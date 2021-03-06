export const validate = (form, errors) => {
  if (errors) {
    Object.keys(errors).forEach((key) => {
      form.states[key] = false;
      form.errors[key] = errors[key].length && errors[key][0];
    });
  }
}

export const reset = (form) => {
  Object.keys(form.states).forEach((key) => {
    form.states[key] = null;
    form.errors[key] = null;
  });
}

export const showNotification = (instance, variant, msg, autoHideDelay=2000) => {
  instance.$bvToast.toast(msg, {
    title: "Notification",
    variant: variant,
    solid: true,
    autoHideDelay: autoHideDelay,
  })
}

export const clearFields = (form) => {
  let keyField = form.fields
  for(let key in keyField){
    if (typeof keyField[key] !== "object") {
      if(typeof keyField[key] == "number"){
        keyField[key] = 0
      }
      else{
        keyField[key] = null
      }
    } 
    else {
      let innerFields = keyField[key]
      for (let innerKey in innerFields) {
        innerFields[innerKey] = null
      }
    }
  }
}

// format number with comma and decimal place
export const formatNumber = (value, decimal = 2) => {
  let val = (value/1).toFixed(decimal)
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}