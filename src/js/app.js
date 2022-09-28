// Variables 
const form = document.querySelector('.tip-form');
const billInput = document.querySelector('#bill');
const percentagesInputs = document.querySelectorAll('input[type="radio"]');
const customInput = document.querySelector('#tip-c');
const numberPeopleInput = document.querySelector('#NoP');
const checked = document.createAttribute('checked');
const reset = document.querySelector('#reset');
// Classes
class Summary{
    constructor(bill, percentage, people){
        this.bill = bill;
        this.percentage = percentage;
        this.people = people;
        this.tipPP = '';
        this.tipTotal = '';
        this.calcTip();
    }
    calcTip() {
        this.tipPP = parseFloat((this.bill * this.percentage));
        this.tipTotal = this.tipPP * this.people;
    }

    reset() {
        this.bill = 0;
        this.percentage = 1.05;
        this.people = 0;
        this.calcTip();
    }
}

class UI {
    printTip(summary) {
        const {bill, people, percentage, tipPP, tipTotal} = summary;
        const summaryAmount = document.querySelector('#amount span');
        const summaryTotal = document.querySelector('#total span');
        
        if(bill !== 0) {
            summaryAmount.textContent = tipPP.toFixed(2);
        } else {
            summaryAmount.textContent = '0.00';
        }

        if(people !== 0) {
            summaryTotal.textContent = tipTotal.toFixed(2);
        } else {
            summaryTotal.textContent = '0.00';
        }
    }

    printError(message, reference){
        const errores = document.querySelectorAll('.error');
        const div = document.createElement('div');
        div.classList.add('error');
        div.textContent = message;

        if(errores.length === 0) {
            form.insertBefore(div, reference.nextSibling);
            setTimeout(() => {
                div.remove();
            }, 3000);
        }
    }
}

const ui = new UI();
let summary;

// Event Listeners
events();

function events(){
    billInput.addEventListener('input', buildBill);
    document.addEventListener('DOMContentLoaded', () => {
        percentagesInputs.forEach(percentageInput => {
            if(percentageInput.value === '1.05') {
                percentageInput.setAttributeNode(checked);
                buildBill();
            }
        });
    });
    percentagesInputs.forEach(percentageInput => {
        percentageInput.addEventListener('input', () => {
            document.querySelector('input[type="radio"][checked]').removeAttributeNode(checked);
            percentageInput.setAttributeNode(checked);
            buildBill();
        });
    });
    customInput.addEventListener('input', buildBill);
    numberPeopleInput.addEventListener('input', (e) => {
        if(e.target.value === '' || e.target.value === '0') {
            const reference = document.querySelector('#peopleDiv');
            ui.printError('Can\'t be zero', reference);
            return;
        }

        buildBill();
    });
    numberPeopleInput.addEventListener('blur', () => {
    
    });
    reset.addEventListener('click', (e) => {
        e.preventDefault();
        form.reset();
        summary.reset();
        ui.printTip(summary);
    });
}

// Functions
function buildBill() {
    // Bill
    let bill;
    if(billInput.value.includes(',')) {
        bill = Number(billInput.value.replace(/,/g, '.'));
    } else {
        bill = Number(billInput.value);
    }
    // Percentage
    let percentage;
    if(customInput.value === '') {
        const checked = document.querySelector('input[type="radio"][checked]').value;
        percentage = parseFloat(checked);
    } else {
        percentage = parseFloat(customInput.value);
    }
    // People
    const people = Number(numberPeopleInput.value);
    // Validation
    const response = validate(bill, percentage, people);
    
    if(response) {
        summary = new Summary(bill, percentage, people);
        console.log(summary);
        ui.printTip(summary);
    }
}

function validate(bill, percentage, people){
    if(isNaN(bill)) {
        const reference = document.querySelector('#billDiv');
        ui.printError('Introduce only numbers', reference);
        return false;
    }
    if(isNaN(percentage)) {
        const reference = document.querySelector('.tip-select');
        ui.printError('Introduce only numbers', reference);
        return false;
    }
    if(isNaN(people)) {
        const reference = document.querySelector('#peopleDiv');
        ui.printError('Introduce only numbers', reference);
        return false;
    }
    
    return true;
}