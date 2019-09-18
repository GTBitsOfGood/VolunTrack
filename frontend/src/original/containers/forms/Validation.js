const isRequired = val => !val;

const isEmail = val => !val.contains('@') && !val.contains('.');

const isLong = val => val.length >= 5;
