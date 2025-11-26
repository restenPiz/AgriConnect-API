<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('farmer')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($product) {
                // Processar image_urls com múltiplos níveis de escape
                $imageUrls = $product->image_urls;

                // Remover escapes extras
                if (is_string($imageUrls)) {
                    // Decodificar múltiplas vezes se necessário
                    while (is_string($imageUrls) && (strpos($imageUrls, '\\') !== false || strpos($imageUrls, '"[') !== false)) {
                        $imageUrls = json_decode($imageUrls, true);
                    }

                    // Se ainda for string, tentar decodificar uma vez mais
                    if (is_string($imageUrls)) {
                        $imageUrls = json_decode($imageUrls, true);
                    }
                }

                // Garantir que é array
                if (!is_array($imageUrls)) {
                    $imageUrls = [];
                }

                // Limpar barras invertidas das URLs
                $imageUrls = array_map(function ($url) {
                    return str_replace(['\\/', '\\\\'], ['/', ''], $url);
                }, $imageUrls);

                // Pegar primeira imagem ou usar emoji padrão
                $firstImage = !empty($imageUrls) ? $imageUrls[0] : '📦';

                // Determinar status baseado no estoque
                $status = $product->status;
                if ($product->available_quantity == 0) {
                    $status = 'out_of_stock';
                } elseif ($product->available_quantity < 100) {
                    $status = 'low_stock';
                }

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'farmer' => $product->farmer ? $product->farmer->name : 'Unknown',
                    'farmer_id' => $product->farmer_id,
                    'category' => ucfirst($product->category),
                    'price' => (float) $product->price,
                    'unit' => $product->unit,
                    'stock' => (float) $product->available_quantity,
                    'status' => $status,
                    'image' => $firstImage,
                    'image_urls' => $imageUrls,
                    'is_organic' => $product->is_organic,
                    'harvest_date' => $product->harvest_date,
                    'expiry_date' => $product->expiry_date,
                    'rating' => $product->rating,
                    'review_count' => $product->review_count,
                    'created_at' => $product->created_at->format('Y-m-d'),
                ];
            });

        return Inertia::render('Pages/Product', [
            'products' => $products,
        ]);
    }
}
