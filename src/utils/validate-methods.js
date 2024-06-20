const isPositiveInteger = ( value ) => {
    
    if (!isParamString( value )) 
        return false;
    
    let numValue = Number(value)

    if ( !Number.isInteger(numValue))
        return true;
    if( numValue < 0 )
        return true
    
    return false
    
}

const isParamString = ( value ) => {

    
    if ((typeof value !== 'string') || (value == '') || (value == null) ) 
        return false;
     return true;
}

const getIntersection = (setA, setB) => {
    const intersection = new Set(
      [...setA].filter(element => setB.has(element))
    );
  
    return intersection;
  }

module.exports= { isPositiveInteger, isParamString, getIntersection }