<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Paymentsds\MPesa\Client;

class PaymentController extends Controller
{
    private $mpesaClient;
    private $serviceProviderCode;

    public function __construct()
    {
        // Inicializar cliente M-Pesa
        $this->mpesaClient = new Client([
            'apiKey' => env('MPESA_API_KEY'),
            'publicKey' => env('MPESA_PUBLIC_KEY'),
            'serviceProviderCode' => env('MPESA_SERVICE_PROVIDER_CODE', '171717'),
        ]);

        $this->serviceProviderCode = env('MPESA_SERVICE_PROVIDER_CODE', '171717');
    }

    /**
     * Iniciar pagamento M-Pesa
     */
    public function initiateMpesaPayment(Request $request)
    {
        $request->validate([
            'phone_number' => 'required|string',
            'amount' => 'required|numeric|min:1',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        try {
            $userId = $request->user()->id;
            $phoneNumber = $request->phone_number;
            $amount = $request->amount;
            $items = $request->items;

            Log::info('Iniciando pagamento M-Pesa', [
                'user_id' => $userId,
                'phone' => $phoneNumber,
                'amount' => $amount
            ]);

            // 1. Criar pedido no banco
            $order = Order::create([
                'buyer_id' => $userId,
                'cooperative_id' => 2,
                'total_amount' => $amount,
                'status' => 'pending',
                'payment_method' => 'mobile_money',
                'payment_status' => 'pending',
            ]);

            Log::info('Pedido criado', ['order_id' => $order->id]);

            // 2. Criar itens do pedido
            foreach ($items as $item) {
                $product = Product::findOrFail($item['product_id']);

                $quantity = $item['quantity'];
                $unitPrice = $item['price'];
                $totalPrice = $quantity * $unitPrice;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'farmer_id' => $product->farmer_id,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'total_price' => $totalPrice,
                    'status' => 'pending',
                ]);

                Log::info('Item adicionado', [
                    'product_id' => $product->id,
                    'farmer_id' => $product->farmer_id,
                    'quantity' => $quantity
                ]);
            }

            // 3. Gerar referência e transação
            $transaction = 'TXN' . strtoupper(Str::random(8));
            $reference = 'ORD' . $order->id . random_int(1000, 9999);

            // 4. Limpar número de telefone (remover 258 se existir)
            $cleanPhone = str_replace('258', '', $phoneNumber);

            // 5. Preparar dados para M-Pesa
            $paymentData = [
                'from' => '258' . $cleanPhone, // Garantir formato correto
                'reference' => $reference,
                'transaction' => $transaction,
                'amount' => (string) $amount, // M-Pesa precisa como string
            ];

            Log::info('Enviando dados para M-Pesa:', $paymentData);

            // 6. Chamar API M-Pesa usando SDK
            $result = $this->mpesaClient->receive($paymentData);

            Log::info('Resposta do M-Pesa:', [
                'result' => json_encode($result)
            ]);

            // 7. Verificar sucesso usando Reflection (como no seu código)
            $reflection = new \ReflectionClass($result);
            $successProperty = $reflection->getProperty('success');
            $successProperty->setAccessible(true);
            $success = $successProperty->getValue($result);

            if ($success) {
                // Pagamento iniciado com sucesso
                $order->update([
                    'transaction_id' => $transaction,
                    'payment_status' => 'processing',
                ]);

                Log::info('Pagamento M-Pesa bem-sucedido', [
                    'order_id' => $order->id,
                    'transaction' => $transaction
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Pagamento iniciado! Verifique seu telefone M-Pesa para confirmar.',
                    'data' => [
                        'order_id' => $order->id,
                        'transaction_id' => $transaction,
                        'reference' => $reference,
                        'amount' => $amount,
                    ],
                ], 201);
            } else {
                // Pagamento falhou
                $order->update(['payment_status' => 'failed']);

                Log::warning('Pagamento M-Pesa falhou', [
                    'order_id' => $order->id,
                    'response' => json_encode($result)
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Pagamento não autorizado. Verifique seu saldo M-Pesa.',
                ], 400);
            }

        } catch (\Exception $e) {
            Log::error('Erro no pagamento M-Pesa', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao processar pagamento',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Webhook para confirmação M-Pesa (opcional)
     */
    public function mpesaCallback(Request $request)
    {
        Log::info('Callback M-Pesa recebido', $request->all());

        try {
            // Processar confirmação do pagamento
            $transactionId = $request->input('transaction_id');

            $order = Order::where('transaction_id', $transactionId)->first();

            if ($order) {
                $order->update([
                    'payment_status' => 'completed',
                    'status' => 'confirmed',
                ]);

                Log::info('Pagamento confirmado via callback', [
                    'order_id' => $order->id
                ]);
            }

            return response()->json(['success' => true], 200);

        } catch (\Exception $e) {
            Log::error('Erro no callback M-Pesa', [
                'error' => $e->getMessage()
            ]);

            return response()->json(['success' => false], 500);
        }
    }
}
