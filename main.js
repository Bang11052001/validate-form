function validator(form,option) {
    var formElement = document.querySelector(form);
    var formRule = [];
    var data;

    var validatorRules = {
        email : function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Email khong chinh xac';
        },
    
        required : function(value) {
            return value !=='' ? undefined : 'vui long nhap truong nay';
        },
            
        password : function(value){
            var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            return regex.test(value) ? undefined : 'mat khau khong chinh xac';
        },
        
        passwordConfirm : function(value){
            return (value == data.passwordValue && data.isValid) ? undefined : 'mat khau khong chinh xac';
        }
    }

    // ham validator
    function handelValidator(inputElement) {
        var errorElement = inputElement.closest('.form-group').querySelector('.form-message');
        var formGroup = inputElement.closest('.form-group');
            
            var rules = formRule[inputElement.name];
            for(var i in rules){
                
                // lay data password de confirm password
                if(inputElement.name == 'password'){
                    passwordValue = inputElement.value;
                    isValid = !(rules[i](inputElement.value));
                    data ={
                        passwordValue: passwordValue,
                        isValid: isValid
                    }
                }

                errorMessage = (rules[i](inputElement.value));

                if(errorMessage){
                    errorElement.innerText = errorMessage;
                    formGroup.classList.add('invalid');
                    break;
                }
                else{
                    errorElement.innerText = '';
                    formGroup.classList.remove('invalid');
                }
            }
            return !errorMessage;
    }

    if(formElement){
        var inputElements = document.querySelectorAll('[name][rules]');
        var rules;

        inputElements.forEach(function(inputElement) {
            rules = inputElement.getAttribute('rules').split('|');
            rules.forEach(function(rule) {
            var condition = rule.includes(':');
                
                if(condition){
                    ruleInfo = rule.split(':');
                    rule = ruleInfo[0];
                }

                var ruleFunc = validatorRules[rule];

                if(condition){
                    ruleFunc = validatorRules[rule](ruleInfo[1]);
                }

                if(Array.isArray(formRule[inputElement.name])){
                    formRule[inputElement.name].push(ruleFunc);
                }
                else{
                    formRule[inputElement.name] = [ruleFunc];
                }
            })
        })


        // su ly su kien click va blur
        inputElements.forEach(function(inputElement) {
            inputElement.onblur = function(){
                handelValidator(inputElement) 
            }

            inputElement.onclick = function(){
                var errorElement = inputElement.closest('.form-group').querySelector('.form-message');
                var formGroup = inputElement.closest('.form-group');
                if(formGroup.classList.contains('invalid')){
                    formGroup.classList.remove('invalid');
                    errorElement.innerText = '';
                }
            }
        })
        
        // su ly su kien submit
        if(typeof option.onSubmit == 'function'){
            formElement.onsubmit = function(e) {
                var isTrue = true;
                var data ={};
                e.preventDefault();
                inputElements.forEach(function(inputElement) {
                    isTrue = handelValidator(inputElement);
                })

                // lay data khi click vao sub
                if(isTrue){
                    inputElements = document.querySelectorAll('input[name]');
                    data = Array.from(inputElements).reduce(function(values,inputElement) {
                        values[inputElement.name] = inputElement.value;

                        if(inputElement.value == ''){
                            values[inputElement.name] ='';
                        }

                        return values;
                    },{})
                    option.onSubmit(data);
                }
            }
        }
    }
}


