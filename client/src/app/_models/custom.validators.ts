import { AbstractControl, ValidatorFn } from "@angular/forms";

export class customValidator {
    static matchValues(matchTo: string): ValidatorFn {
        return (control: AbstractControl) => {
            console.log(control);
            console.log(control?.parent);
            console.log(control?.parent?.controls);
            //return control?.value ===  ? null : { isMatching: true };
            return null;
        }
    }
}