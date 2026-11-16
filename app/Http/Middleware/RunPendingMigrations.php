<?php

namespace App\Http\Middleware;

use App\Support\AutoMigrator;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RunPendingMigrations
{
    public function handle(Request $request, Closure $next): Response
    {
        AutoMigrator::runIfNeeded();

        return $next($request);
    }
}
