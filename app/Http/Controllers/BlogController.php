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

        return Inertia::render('Blog', [
            'posts' => $posts,
            'filters' => $request->only(['type']),
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
