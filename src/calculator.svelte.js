function replaceCharacter(index, txt, newCharacter){
    let characters = txt.split('')
    characters[index] = newCharacter
    return characters.join('')
}

function isInteger(number) {
    return number % 1 === 0
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
        if (inputContainsResult){
            return
        }
        const lastCharacterAdded = input[input.length - 1]
        let operatorsRegex = /\/|\+|\*/
        if (operatorsRegex.test(lastCharacterAdded)){
            display = lastCharacterAdded
        }else{
            let numbers = getNumbers(input, true)
            const number = numbers[numbers.length - 1]
            display = `${number}`
        }
    }

    const numberRegex = /((\d+\.\d+|\d+)|\((\+|-)(\d+\.\d+|\d+)\))/g

    function getNumbers(expression, string = false){
        let matches = expression.match(numberRegex)
        if (matches){
            matches = matches.map((number) => string ? number : +number.replace(/\(|\)/g, ''))
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

    function getPrioritaryExpression(txt){
        const multiplyAndDivideRegex = /(\*|\/)/g
        const sumAndSubstractRegex = /(\+|-)/g
        const multiplyAndDivideExpressionRegex = new RegExp(`${numberRegex.source}${multiplyAndDivideRegex.source}${numberRegex.source}`, 'g')
        const sumAndSubstractExpressionRegex = new RegExp(`${numberRegex.source}${sumAndSubstractRegex.source}${numberRegex.source}`, 'g')

        const multiplyAndDivideExpressions = txt.match(multiplyAndDivideExpressionRegex)
        const sumAndSubstractExpressions = txt.match(sumAndSubstractExpressionRegex)

        if (multiplyAndDivideExpressions == null && sumAndSubstractExpressions == null){
            console.log(txt, input)
        }
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
            let number = +input.replace(/\(|\)|\*|\+/g, '')
            return number
        }
        const prioritaryExpression = getPrioritaryExpression(input)

        input = input.replace(prioritaryExpression, evaluateExpression(prioritaryExpression))

        return doCalculation(input)
    }
    function isThereAnOpenParenthesis(input){
        let matches = []
        let match; 
        const regex = /\({1}/g
        while ((match = regex.exec(input)) != null){
            matches.push(match)
        }
        if(matches.length > 0){
            const lastMatch = matches[matches.length - 1]
            return !/\)/.test(input.slice(lastMatch.index,))
        }
        return false
    }
    function closeOpenParenthesis(input, char){
        return input + `)${char}`
    }
    
    function removePurposelessParenthesis(input){
        const inputArr = input.split('')
        inputArr.splice(input.length - 2, 2)
        return inputArr.join('')
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
        if (input.length > 2 && operatorsRegex.test(c)){
            const isThereANoPurposeOpenParenthesis = `${input[input.length - 2]}${input[input.length - 1]}` == "(-"
            if (isThereANoPurposeOpenParenthesis){
                input = removePurposelessParenthesis(input)
            }
        }
        if (!(/\d+|\./.test(c)) && isThereAnOpenParenthesis(input)){
            input = closeOpenParenthesis(input, c)
            return
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
                    const alreadyContainsFloatingPoint = () => /\./.test(currentNumber)

                    if (!alreadyContainsFloatingPoint()){
                        input += c
                    }
                }
            }
            return
        }
        if (c == "-"){
            const lastCharacterAdded = input[input.length - 1]
            if (/\.|-/.test(lastCharacterAdded)){
                return
            }
            if (/\d+/.test(lastCharacterAdded)){
                input += "-"
                return
            }
            input += "(-"
            return
        }
        if (operatorsRegex.test(c) && operatorsRegex.test(input[input.length - 1])){
            input = replaceCharacter(input.length - 1, input, c)
            return
        }
        input += c
    }

    function AC(){
        inputContainsResult = false
        input = "0"
    }

    function getResult(){
        if (inputContainsResult){
            return
        }
        if (isThereAnOpenParenthesis(input)){
            input += ")"
        }
        const result = doCalculation(formatInput(input))
        inputContainsResult = true
        input = `${input}=${result}`
        display = `${result}`
    }

    return {
        get input(){return input},
        get display(){return display},
        appendCharacter,
        AC,
        getResult
    }
}