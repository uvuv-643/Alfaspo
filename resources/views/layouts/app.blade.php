<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css'])

        @livewireStyles

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer" />


    </head>
    <body class="font-sans antialiased">
        <div class="min-h-screen bg-gray-100">
            @include('layouts.navigation')

            <!-- Page Heading -->
            @if (isset($header))
                <header class="bg-white shadow">
                    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {{ $header }}
                    </div>
                </header>
            @endif

            <!-- Page Content -->
            <main>
                {{ $slot }}
            </main>
        </div>

        @livewireScripts

        <script>
            Livewire.on('laraveltable:action:confirm', (actionType, actionIdentifier, modelPrimary, confirmationQuestion) => {
                if (window.confirm(confirmationQuestion)) {
                    Livewire.emit('laraveltable:action:confirmed', actionType, actionIdentifier, modelPrimary);
                }
            });
            Livewire.on('laraveltable:link:open:newtab', (url) => {
                window.open(url, '_blank').focus();
            });
        </script>

        <script>
            // Get all forms on the page
            var forms = document.querySelectorAll("form");

            // Loop through each form and attach a submit event listener
            forms.forEach(function (form) {
                form.addEventListener("submit", function (event) {
                    event.preventDefault(); // Prevent the form from submitting normally

                    // Replace commas with dots in all input fields within this form
                    var inputs = form.querySelectorAll("input[type='text']");
                    inputs.forEach(function (input) {
                        input.value = input.value.replace(/,/g, '.');
                    });

                    // Now submit the form
                    form.submit();
                });
            });
        </script>

    </body>
</html>
