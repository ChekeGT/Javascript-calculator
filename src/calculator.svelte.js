function replaceCharacter(index, txt, newCharacter){
    let characters = txt.split('')
    characters[index] = newCharacter
    return characters.join('')
}

export default function createCalculator(){
    
    let input = $state('0')

    let display = $state('')
    
    let inputContainsResult = $state(false)
    
    const operatorsRegex = /(\/|\+|-|\*)/
    
    $effect(() => {
        renderDisplay(input)
    })

    function renderDisplay(input){
        const lastCharacterAdded = input[input.length - 1]
        if (operatorsRegex.test(lastCharacterAdded)){
            display = lastCharacterAdded
        }else{
            let numbers = getNumbers(input)
            display = numbers[numbers.length - 1]
        }
    }

    const numberRegex = /((\d+\.\d+|\d+)|\((\+|-)(\d+\.\d+|\d+)\))/g

    function getNumbers(expression){
        let matches = expression.match(numberRegex)
        if (matches){
            matches = matches.map((number) => +number.replace(/\(|\)/g, ''))
        }
       return matches
    }
    function getOperator(expression){
        let firstMatch = expression.match(numberRegex)[0];
        const operator = expression[firstMatch.length]
        return operator
    }
    function evaluateExpression(expression){
        const numbers = getNumbers(expression)
        const operator = getOperator(expression)
        if (numbers.length != 2){
            return
        }

        const firstNumber = numbers[0]
        const secondNumber = numbers[1]

        let result; 
        switch(operator){
            case "/":
                result =  firstNumber / secondNumber
                break
            case "*":
                result =  firstNumber * secondNumber
                break
            case "+":
                result = firstNumber + secondNumber
                break
            case "-":
                result = firstNumber - secondNumber
                break
            default: 
                break
        }
        if (result < 0){
            return `(${result})`
        }
        return result
    }

    function getPrioritaryExpression(input){
        const multiplyAndDivideRegex = /(\*|\/)/g
        const sumAndSubstractRegex = /(\+|-)/g
        const multiplyAndDivideExpressionRegex = new RegExp(`${numberRegex.source}${multiplyAndDivideRegex.source}${numberRegex.source}`, 'g')
        const sumAndSubstractExpressionRegex = new RegExp(`${numberRegex.source}${sumAndSubstractRegex.source}${numberRegex.source}`, 'g')

        const multiplyAndDivideExpressions = input.match(multiplyAndDivideExpressionRegex)
        const sumAndSubstractExpressions = input.match(sumAndSubstractExpressionRegex)

        
        if (multiplyAndDivideExpressions == null){
            return sumAndSubstractExpressions[0]
        }
        return multiplyAndDivideExpressions[0]
    }

    function formatInput(input){
        if (input.startsWith('-')){
            let negativeNumberRegex = new RegExp(`-${numberRegex.source}`, 'g')
            if (negativeNumberRegex.test(input)){
                let firstNegativeNumber = input.match(negativeNumberRegex)[0] 
                input = input.replace(firstNegativeNumber, `(${firstNegativeNumber})`)
            }
        }
        return input
    }

    function doCalculation(input){
        if (!input){
            return
        }
        let numbers = getNumbers(input)
        if (!numbers){
            return input.replace(/\(|\)|\*|\+/g, '')
        }
        if (numbers.length == 1){
            return input.replace(/\(|\)|\*|\+/g, '')
        }
        const prioritaryExpression = getPrioritaryExpression(input)

        input = input.replace(prioritaryExpression, evaluateExpression(prioritaryExpression))

        return doCalculation(input)
    }

    function appendCharacter(c){
        if (inputContainsResult){
            if (operatorsRegex.test(c)){
                input = input.match(/=.+/g)[0].replace(/=/, '') + c
                inputContainsResult = false
                return
            }else{
                AC()
                inputContainsResult = false
                appendCharacter(c)
                return
            }            
        }
        if (input.startsWith("0") && input.length == 1){
            if (c == "." || operatorsRegex.test(c)){
                input += c
                return
            }
            input = c
            return
        }
        if (c == "."){
            if (!operatorsRegex.test(input[input.length - 1])){
                let regex = /([^\*\+\/-])+/g
                let matches = input.match(regex)
                if (matches){
                    const currentNumber = matches[matches.length - 1]
                    console.log(currentNumber)
                    const alreadyContainsFloatingPoint = () => /\./.test(currentNumber)

                    if (!alreadyContainsFloatingPoint()){
                        input += c
                    }
                }
            }
            return
        }
        if (operatorsRegex.test(c) && operatorsRegex.test(input[input.length - 1])){
            input = replaceCharacter(input.length - 1, input, c)
            return
        }
        input += c
    }

    function AC(){
        input = "0"
    }

    function getResult(){
        if (inputContainsResult){
            return
        }
        const result = doCalculation(formatInput(input))
        input = `${input}=${result}`
        display = result
        inputContainsResult = true
    }

    return {
        get input(){return input},
        get display(){return display},
        appendCharacter,
        AC,
        getResult
    }
}