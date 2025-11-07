<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->all();

        $user = Product::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'unit' => $validated['unit'],
            'available_quantity' => $validated['available_quantity'],
        ]);

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $user,
        ], 201);
    }
}
