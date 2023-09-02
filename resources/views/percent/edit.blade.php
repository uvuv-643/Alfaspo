<x-app-layout>

    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Редагувати елемент') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
            <div class="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                <div class="max-w-xl">

                    @if ($errors->any())
                        <div class="alert alert-danger mb-3">
                            <ul class="mb-0">
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    <form action="{{ route('percent.update', $percent) }}" method="post">
                        @csrf
                        @method('put')

                        <section class="space-y-6">

                            <input type="hidden" name="material_id" value="{{ $percent->material_id }}" />

                            <x-input-label for="percent" value="{{ __('Вiдсоток') }}" />
                            <x-text-input
                                id="percent"
                                name="percent"
                                type="text"
                                class="mt-1 block w-full"
                                placeholder="{{ __('Вiдсоток') }}"
                                value="{{ old('percent', $percent->percent) }}"
                            />

                            <div class="mt-4 mb-5">
                                <button class="btn btn-success">Редагувати</button>
                            </div>

                        </section>
                    </form>

                </div>
            </div>
        </div>
    </div>
</x-app-layout>

