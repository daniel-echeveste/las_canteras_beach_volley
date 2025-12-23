<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::where('is_published', true)->latest();

        if ($request->has('type') && in_array($request->type, ['noticia', 'evento', 'torneo'])) {
            $query->where('post_type', $request->type);
        }

        $posts = $query->get();

        $adSettings = \App\Models\Setting::whereIn('key', ['show_ads', 'ad_frequency', 'ad_slot', 'ad_client_id'])
            ->pluck('value', 'key');

        return Inertia::render('Blog', [
            'posts' => $posts,
            'filters' => $request->only(['type']),
            'adSettings' => [
                'show_ads' => $adSettings['show_ads'] ?? '0',
                'ad_frequency' => (int) ($adSettings['ad_frequency'] ?? 3),
                'ad_slot' => $adSettings['ad_slot'] ?? '',
                'ad_client_id' => $adSettings['ad_client_id'] ?? '',
            ],
        ]);
    }

    public function show($slug)
    {
        $post = Post::where('slug', $slug)->where('is_published', true)->firstOrFail();
        return Inertia::render('Post', [
            'post' => $post
        ]);
    }
}
