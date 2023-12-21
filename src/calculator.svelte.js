export default function createCalculator(){
    
    let input = $state('')

    let result = $derived(doCalculation(formatInput(input)))

    const numberRegex = /((\d+\.\d+|\d+)|\((\+|-)(\d+\.\d+|\d+)\))/g

    function getNumbers(expression){
       return expression.match(numberRegex).map((number) => +number.replace(/\(|\)/g, ''))
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
            let firstNegativeNumber = input.match(negativeNumberRegex)[0] 
            input = input.replace(firstNegativeNumber, `(${firstNegativeNumber})`)
        }
        return input
    }

    function doCalculation(input){
        let numbers = getNumbers(input)
        if (numbers.length == 1){
            return input.replace(/\(|\)|\*|\+/g, '')
        }
        const prioritaryExpression = getPrioritaryExpression(input)

        input = input.replace(prioritaryExpression, evaluateExpression(prioritaryExpression))

        return doCalculation(input)
    }

}