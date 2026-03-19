<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OrderItem;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FinanceController extends Controller
{
    /**
     * Obter resumo financeiro do agricultor
     */
    public function getFarmerFinances(Request $request)
    {
        try {
            $farmerId = $request->user()->id;
            Log::info('Buscando dados financeiros para agricultor', ['farmer_id' => $farmerId]);

            // Total de vendas (todos os tempos)
            $totalSales = OrderItem::where('farmer_id', $farmerId)
                ->whereHas('order', function ($query) {
                    $query->whereIn('payment_status', ['processing']);
                })
                ->sum('total_price');

            // Vendas do mês atual
            $currentMonthSales = OrderItem::where('farmer_id', $farmerId)
                ->whereHas('order', function ($query) {
                    $query->whereIn('payment_status', ['processing'])
                        ->whereMonth('created_at', now()->month)
                        ->whereYear('created_at', now()->year);
                })
                ->sum('total_price');

            // Vendas do dia
            $todaySales = OrderItem::where('farmer_id', $farmerId)
                ->whereHas('order', function ($query) {
                    $query->whereIn('payment_status', ['processing'])
                        ->whereDate('created_at', today());
                })
                ->sum('total_price');

            // Número total de pedidos
            $totalOrders = OrderItem::where('farmer_id', $farmerId)
                ->whereHas('order', function ($query) {
                    $query->whereIn('payment_status', ['processing']);
                })
                ->distinct('order_id')
                ->count('order_id');

            // Produtos vendidos (quantidade total)
            $totalProductsSold = OrderItem::where('farmer_id', $farmerId)
                ->whereHas('order', function ($query) {
                    $query->whereIn('payment_status', ['processing']);
                })
                ->sum('quantity');

            // Top 5 produtos mais vendidos
            $topProducts = OrderItem::where('farmer_id', $farmerId)
                ->whereHas('order', function ($query) {
                    $query->whereIn('payment_status', ['processing']);
                })
                ->select(
                    'product_id',
                    DB::raw('SUM(quantity) as total_quantity'),
                    DB::raw('SUM(total_price) as total_revenue')
                )
                ->with('product:id,name,image_urls,unit')
                ->groupBy('product_id')
                ->orderBy('total_revenue', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($item) {
                    return [
                        'product_id' => $item->product_id,
                        'product_name' => $item->product->name ?? 'Produto',
                        'product_image' => $item->product->image_urls[0] ?? null,
                        'unit' => $item->product->unit ?? 'kg',
                        'total_quantity' => $item->total_quantity,
                        'total_revenue' => $item->total_revenue,
                    ];
                });

            // Vendas dos últimos 7 dias
            $last7DaysSales = [];
            for ($i = 6; $i >= 0; $i--) {
                $date = now()->subDays($i);
                $sales = OrderItem::where('farmer_id', $farmerId)
                    ->whereHas('order', function ($query) use ($date) {
                        $query->whereIn('payment_status', ['processing'])
                            ->whereDate('created_at', $date);
                    })
                    ->sum('total_price');

                $last7DaysSales[] = [
                    'date' => $date->format('d/m'),
                    'day' => $date->format('D'),
                    'sales' => $sales,
                ];
            }

            // Pedidos recentes (últimos 10)
            $recentOrders = OrderItem::where('farmer_id', $farmerId)
                ->with([
                    'order:id,buyer_id,total_amount,status,payment_status,created_at',
                    'order.buyer:id,name,phone_number',
                    'product:id,name,image_urls,unit'
                ])
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($item) {
                    return [
                        'order_id' => $item->order_id,
                        'product_name' => $item->product->name ?? 'Produto',
                        'product_image' => $item->product->image_urls[0] ?? null,
                        'buyer_name' => $item->order->buyer->name ?? 'Cliente',
                        'buyer_phone' => $item->order->buyer->phone_number ?? '',
                        'quantity' => $item->quantity,
                        'unit' => $item->product->unit ?? 'kg',
                        'unit_price' => $item->unit_price,
                        'total_price' => $item->total_price,
                        'status' => $item->status,
                        'payment_status' => $item->order->payment_status ?? 'pending',
                        'created_at' => $item->created_at->format('d/m/Y H:i'),
                    ];
                });

            $responseData = [
                'summary' => [
                    'total_sales' => $totalSales,
                    'current_month_sales' => $currentMonthSales,
                    'today_sales' => $todaySales,
                    'total_orders' => $totalOrders,
                    'total_products_sold' => $totalProductsSold,
                ],
                'top_products' => $topProducts,
                'last_7_days_sales' => $last7DaysSales,
                'recent_orders' => $recentOrders,
            ];

            Log::info('Dados preparados', [
                'summary' => $responseData['summary'],
                'top_products_count' => count($responseData['top_products']),
                'recent_orders_count' => count($responseData['recent_orders']),
            ]);

            $response = response()->json([
                'success' => true,
                'data' => $responseData,
            ]);

            Log::info('Resposta JSON enviada', [
                'response' => $response->getData()
            ]);

            return $response;
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar dados financeiros',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obter detalhes de vendas por período
     */
    public function getSalesByPeriod(Request $request)
    {
        try {
            $farmerId = $request->user()->id;
            Log::info('Buscando vendas por período para agricultor', ['farmer_id' => $farmerId]);
            $period = $request->query('period', 'month'); // day, week, month, year

            $query = OrderItem::where('farmer_id', $farmerId)
                ->whereHas('order', function ($q) {
                    $q->whereIn('payment_status', ['processing']);
                });

            switch ($period) {
                case 'day':
                    $query->whereDate('created_at', today());
                    break;
                case 'week':
                    $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
                    break;
                case 'month':
                    $query->whereMonth('created_at', now()->month)
                        ->whereYear('created_at', now()->year);
                    break;
                case 'year':
                    $query->whereYear('created_at', now()->year);
                    break;
            }

            $sales = $query->with(['product:id,name', 'order:id,created_at,payment_status'])
                ->get()
                ->map(function ($item) {
                    return [
                        'product_name' => $item->product->name ?? 'Produto',
                        'quantity' => $item->quantity,
                        'unit_price' => $item->unit_price,
                        'total_price' => $item->total_price,
                        'date' => $item->created_at->format('d/m/Y'),
                        'payment_status' => $item->order->payment_status ?? 'pending',
                    ];
                });

            $totalRevenue = $sales->sum('total_price');

            return response()->json([
                'success' => true,
                'data' => [
                    'period' => $period,
                    'total_revenue' => $totalRevenue,
                    'sales' => $sales,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar vendas por período',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
