<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Управління цінами та вагою') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">

                    <div class="d-flex">
                        <div>
                            <a target="_blank" href="{{ route('price.create', $materials[0]->id) }}" class="btn btn-success" title="Войлок">
                                + {{ $materials[0]->title }}
                            </a>
                        </div>
                        <div class="ml-4">
                            <a target="_blank" href="{{ route('price.create', $materials[1]->id) }}" class="btn btn-success" title="Войлок">
                                + {{ $materials[1]->title }}
                            </a>
                        </div>
                        <div class="ml-4">
                            <a target="_blank" href="{{ route('price.create', $materials[2]->id) }}" class="btn btn-success" title="Войлок">
                                + {{ $materials[2]->title }}
                            </a>
                        </div>
                    </div>

                    <livewire:table :config="App\Tables\PriceTable::class"/>

                </div>
            </div>
        </div>
    </div>
</x-app-layout>
