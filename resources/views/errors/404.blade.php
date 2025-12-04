<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>404 - Página no encontrada | Las Canteras Vóley</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600,700&display=swap" rel="stylesheet" />
    <style>
        body { font-family: 'Figtree', sans-serif; }
    </style>
</head>
<body class="bg-[#FFF8E8] text-gray-800 min-h-screen flex items-center justify-center px-4">
    <div class="max-w-lg w-full text-center">
        <div class="mb-8">
            <h1 class="text-9xl font-extrabold text-[#1CA9C9]">404</h1>
            <p class="text-2xl font-semibold text-gray-700 mt-4">¡Ups! Página no encontrada</p>
            <p class="text-gray-600 mt-2">Parece que la pelota se fue fuera de la cancha. La página que buscas no existe o ha sido movida.</p>
        </div>

        <div class="space-y-4">
            <a href="/" class="inline-block px-8 py-3 bg-[#1CA9C9] text-white font-bold rounded-full hover:bg-[#158BA8] transition-colors duration-300 shadow-lg transform hover:-translate-y-1">
                Volver al Inicio
            </a>
        </div>

        <div class="mt-12">
            <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-[#1CA9C9] w-2/3 rounded-full animate-pulse"></div>
            </div>
        </div>
    </div>
</body>
</html>
