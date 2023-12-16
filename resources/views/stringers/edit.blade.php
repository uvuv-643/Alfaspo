@php use Illuminate\Support\Str; @endphp

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

                        <div class="alert alert-info mb-3">
                            <ul class="mb-0">
                                <ul>
                                    <li>Сталь панель - 6000мм</li>
                                    <li>Сталь стрiнгер - 3900мм</li>
                                    <li>Алюмiнiй панель - 4000мм</li>
                                    <li>Алюмiнiй стрiнгер - 3600мм</li>
                                    <li>Акустична панель - 5000мм</li>
                                    <li>Акустична стрiнгер - 5000мм (4000мм висота=105мм)</li>
                                </ul>
                            </ul>
                        </div>

                    <form action="{{ route('price.stringers.update', $price) }}" method="post">
                        @csrf
                        @method('put')

                        <section class="space-y-6">

                            <input type="hidden" name="material_id" value="{{ $price->material->id }}"/>

                            <header>
                                <h2 class="text-lg font-medium text-gray-900">
                                    {{ $price->material->title }}
                                </h2>
                            </header>


                            <x-input-label for="stringer_color_id" value="{{ __('Колiр стрiнгера') }}"/>
                            <select
                                class="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm block w-full"
                                id="stringer_color_id" name="stringer_color_id">
                                @foreach ($colors as $color)
                                    <option value="{{ $color->id }}" @if ($price->color->id == $color->id) selected @endif>{{ $color->title }}</option>
                                @endforeach
                            </select>


                            @php
                                $priceElements = [
//                                    ['key' => 'price', 'label' => 'Вартiсть панель (грн)'],
                                    ['key' => 'price_stringer', 'label' => 'Вартiсть стрiнгер (грн)'],
//                                    ['key' => 'price_connector', 'label' => "Вартiсть з`єднувач (грн)"],
//                                    ['key' => 'price_anchor', 'label' => 'Вартiсть анкер (грн)'],
//                                    ['key' => 'price_pin', 'label' => 'Вартiсть шпилька (грн)'],
//                                    ['key' => 'price_screw', 'label' => 'Вартiсть гайка (грн)'],
                                ];
                            @endphp
                            @foreach($priceElements as $element)
                                <x-input-label for="{{ $element['key'] }}" value="{{ $element['label'] }}"/>
                                <x-text-input
                                    id="{{ $element['key'] }}"
                                    name="{{ $element['key'] }}"
                                    type="text"
                                    class="mt-1 block w-full"
                                    placeholder="{{ __('0.0') }}"
                                    value="{{ old($element['key'], $price[$element['key']]) }}"
                                />
                            @endforeach

                                @php
                                    $weightElements = [
//                                        ['key' => 'weight', 'label' => 'Вага панель (кг)'],
                                        ['key' => 'weight_stringer', 'label' => 'Вага стрiнгер (кг)'],
//                                        ['key' => 'weight_connector', 'label' => "Вага з`єднувач (кг)"],
                                    ];
                                @endphp
                                @foreach($weightElements as $element)
                                    <x-input-label for="{{ $element['key'] }}" value="{{ $element['label'] }}"/>
                                    <x-text-input
                                        id="{{ $element['key'] }}"
                                        name="{{ $element['key'] }}"
                                        type="text"
                                        class="mt-1 block w-full"
                                        placeholder="{{ __('0.0') }}"
                                        value="{{ old($element['key'], $price[$element['key']]) }}"
                                    />
                                @endforeach

                            <div class="mt-4 mb-5">
                                <button class="btn btn-success">Оновити</button>
                            </div>

                        </section>
                    </form>

                </div>
            </div>
        </div>
    </div>
</x-app-layout>

