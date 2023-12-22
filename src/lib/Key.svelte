<script>
    let { key, name, className, id } = $props() 

    function handleClick(){

    }
</script>

<button on:click={handleClick} id={`${id}`} class={`flex m-[0.5px] justify-center items-center text-white ${className}`}>{name}</button>

<style>
    
    .delete{
        background-color: rgb(172,67,57);
    }
    .number,.operator{
        width: 80px;
        height: 65px;
    }
    .operator{
        background-color: rgb(102,102,102);
    }
    .number{
        background-color: #4d4d4d;
    }
    .equals{
        background: rgb(0, 68, 102);
        height: 130px;
        width:80px;
    }
    .jumbo{
        width: 160px;
        height: 65px;
    }
</style>