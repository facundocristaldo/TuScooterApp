import { Validator, NG_VALIDATORS, AbstractControl } from '@angular/forms';
import { Directive, Input } from '@angular/core';



@Directive({
    selector:'[appConfirmEqualsValidator]',
    providers:[{
        provide: NG_VALIDATORS,
        useExisting:confirmEqualsValidator,
        multi:true
    }]
})
export class confirmEqualsValidator implements Validator{
    @Input() appConfirmEqualsValidator : string;

    validate(control:AbstractControl):{[key:string]:any}|null{
        const controlToCompare = control.parent.get(this.appConfirmEqualsValidator)
        console.log("validation between " +control.value + " and "+ controlToCompare.value)
        if (controlToCompare && controlToCompare.value !== control.value){
            return {'notEqual':true};
        }
        return null
    }
}
