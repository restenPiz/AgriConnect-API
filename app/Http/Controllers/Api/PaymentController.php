<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    private $apiKey;
    private $publicKey;
    private $serviceProviderCode;
    private $baseUrl;

    public function __construct()
    {
        // Suas credenciais M-Pesa (use .env em produção)
        $this->apiKey = env('MPESA_API_KEY', 'sua_api_key_aqui');
        $this->publicKey = env('MPESA_PUBLIC_KEY', 'sua_public_key_aqui');
        $this->serviceProviderCode = env('MPESA_SERVICE_PROVIDER_CODE', '171717');
        $this->baseUrl = env('MPESA_BASE_URL', 'https://api.sandbox.vm.co.mz'); // Sandbox
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
                'total_amount' => $amount,
                'status' => 'pending',
                'payment_method' => 'mpesa',
                'payment_status' => 'pending',
            ]);

            // 2. Criar itens do pedido
            foreach ($items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                    'subtotal' => $item['quantity'] * $item['price'],
                ]);
            }

            // 3. Gerar referência única
            $transactionReference = 'ORDER' . $order->id . time();

            // 4. Chamar API M-Pesa C2B (Customer to Business)
            $mpesaResponse = $this->sendMpesaRequest(
                $phoneNumber,
                $amount,
                $transactionReference
            );

            Log::info('Resposta M-Pesa', ['response' => $mpesaResponse]);

            if ($mpesaResponse['success']) {
                // Atualizar pedido com dados da transação
                $order->update([
                    'transaction_id' => $mpesaResponse['transaction_id'] ?? $transactionReference,
                    'payment_status' => 'processing',
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Pagamento iniciado! Verifique seu telefone M-Pesa para confirmar.',
                    'data' => [
                        'order_id' => $order->id,
                        'transaction_id' => $transactionReference,
                        'amount' => $amount,
                    ],
                ], 201);
            } else {
                // Falha no M-Pesa
                $order->update(['payment_status' => 'failed']);

                return response()->json([
                    'success' => false,
                    'message' => $mpesaResponse['message'] ?? 'Erro ao processar pagamento M-Pesa',
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
     * Enviar requisição para API M-Pesa
     */
    private function sendMpesaRequest($phoneNumber, $amount, $reference)
    {
        try {
            $endpoint = $this->baseUrl . '/ipg/v1x/c2bPayment/singleStage/';

            $payload = [
                'input_TransactionReference' => $reference,
                'input_CustomerMSISDN' => $phoneNumber,
                'input_Amount' => $amount,
                'input_ThirdPartyReference' => $reference,
                'input_ServiceProviderCode' => $this->serviceProviderCode,
            ];

            Log::info('Enviando requisição M-Pesa', [
                'endpoint' => $endpoint,
                'payload' => $payload
            ]);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
                'Origin' => '*',
            ])->post($endpoint, $payload);

            $responseData = $response->json();

            Log::info('Resposta M-Pesa recebida', [
                'status' => $response->status(),
                'data' => $responseData
            ]);

            if ($response->successful() && isset($responseData['output_ResponseCode'])) {
                $responseCode = $responseData['output_ResponseCode'];

                // INS-0 significa sucesso
                if ($responseCode === 'INS-0') {
                    return [
                        'success' => true,
                        'transaction_id' => $responseData['output_TransactionID'] ?? $reference,
                        'conversation_id' => $responseData['output_ConversationID'] ?? null,
                    ];
                } else {
                    return [
                        'success' => false,
                        'message' => $responseData['output_ResponseDesc'] ?? 'Erro no pagamento',
                        'code' => $responseCode,
                    ];
                }
            }

            return [
                'success' => false,
                'message' => 'Resposta inválida da API M-Pesa',
            ];

        } catch (\Exception $e) {
            Log::error('Erro na requisição M-Pesa', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao conectar com M-Pesa: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Webhook para receber confirmação do M-Pesa
     */
    public function mpesaCallback(Request $request)
    {
        Log::info('Callback M-Pesa recebido', $request->all());

        try {
            $transactionId = $request->input('output_TransactionID');
            $responseCode = $request->input('output_ResponseCode');

            // Encontrar pedido pelo transaction_id
            $order = Order::where('transaction_id', $transactionId)->first();

            if ($order) {
                if ($responseCode === 'INS-0') {
                    // Pagamento confirmado
                    $order->update([
                        'payment_status' => 'completed',
                        'status' => 'confirmed',
                    ]);

                    Log::info('Pagamento confirmado', ['order_id' => $order->id]);
                } else {
                    // Pagamento falhou
                    $order->update([
                        'payment_status' => 'failed',
                        'status' => 'cancelled',
                    ]);

                    Log::warning('Pagamento falhou', [
                        'order_id' => $order->id,
                        'code' => $responseCode
                    ]);
                }
            }

            return response()->json(['success' => true], 200);

        } catch (\Exception $e) {
            Log::error('Erro no callback M-Pesa', ['error' => $e->getMessage()]);
            return response()->json(['success' => false], 500);
        }
    }
}
