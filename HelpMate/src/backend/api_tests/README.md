REST API Documentation

-- POST '/register/student' --
Expected: 
{
    "email": String,
    "password": String,
    "first_name": String,
    "middle_name": String,
    "last_name": String,
    "age": Number(integer),
    "gender": String,
    "department": String
}

Returns:
{
    "email": String,
    "first_name": String,
    "middle_name": String,
    "last_name": String,
    "age": Number(integer),
    "gender": String,
    "department": String
}

-- POST '/register