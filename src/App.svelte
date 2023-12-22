<script>
    import { setContext } from "svelte";
    import createCalculator from "./calculator.svelte";
    import Key from "./lib/Key.svelte";
    
    
    let calculator = createCalculator()

    setContext('appendKey', calculator.appendCharacter)
    setContext('AC', calculator.AC)
    setContext('getResult', calculator.getResult)
    class KeyObj{
        constructor(character, name, className, id, key){
            this.character = character
            this.name = name
            this.className = className
            this.id = id
            this.key = key
        }
    }

    let firstKeys = [
        new KeyObj('Delete', 'AC', 'delete jumbo', 'clear'),
        new KeyObj('/', '/', 'operator', 'divide'),
        new KeyObj('7', '7', 'number', 'seven'),
        new KeyObj('8', '8', 'number', 'eight'),
        new KeyObj('9', '9', 'number', 'nine'),
        new KeyObj('4', '4', 'number', 'four'),
        new KeyObj('5', '5', 'number', 'five'),
        new KeyObj('6', '6', 'number', 'six'),
        new KeyObj('1', '1', 'number', 'one'),
        new KeyObj('2', '2', 'number', 'two'),
        new KeyObj('3', '3', 'number', 'three'),
        new KeyObj('0', '0', 'number jumbo', 'zero'),
        new KeyObj('.', '.', 'number', 'decimal'),
    ]
    let secondKeys = [
        new KeyObj('*', 'x', 'operator', 'multiply'),
        new KeyObj('-', '-', 'operator', 'subtract'),
        new KeyObj('+', '+', 'operator', 'add'),
        new KeyObj('=', '=', 'equals', 'equals', 'Enter')
    ]
    
    let input = $derived(renderCalcValues(calculator.input))
    let display =$derived(renderCalcValues(calculator.display))

    function renderCalcValues(value){
        return value.replace(/\(|\)/g, '')
    }

</script>

<main class="w-[100vw] h-[100vh] bg-[#c2c2d6] flex justify-center items-center flex-col">
    <div class="flex w-[334px] h-[394px] bg-black flex-col p-[4px]">
        <div class="bg-black min-h-[55px] w-[320px]">
            <div class="h-[20px] text-orange-400 font-digital flex justify-end text-xs">{input}</div>
            <div id="display" class="h-[35px text-white font-digital flex justify-end text-sm">{display}</div>
        </div>
        <div class="flex">
            <div class="flex flex-wrap items-end">
                {#each firstKeys as key}
                    <Key {...key}/>
                {/each}
            </div>
            <div>
                {#each secondKeys as key }
                    <Key {...key}/>
                {/each}
            </div>
        </div>
    </div>
</main>

<style>
</style>
