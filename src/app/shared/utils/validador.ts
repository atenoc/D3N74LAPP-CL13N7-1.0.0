import { AbstractControl, ValidatorFn } from '@angular/forms';

export function textValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const forbiddenPattern = /[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/; 
        const isValid = !forbiddenPattern.test(control.value);
        return isValid ? null : { 'invalidText': { value: control.value } };
    };
}

export function textSomeSymbolsValidator(): ValidatorFn {
    //console.log("text address validator"); 
    const regex = new RegExp('^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\\s.,-_#]*$', '');

    return (control: AbstractControl): { [key: string]: any } | null => {
        const value = control.value || '';
        const isValid = regex.test(value);

        return isValid ? null : { 'invalidText': { value } };
    };
}


export function emailValidator(control) {
    const emailRegexp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegexp.test(control.value) ? null : { emailInvalido: true };
}