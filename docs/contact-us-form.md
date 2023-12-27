# API for Mailing Contact Us details Mailing  
contact@\*\*\*\*.com with contact details provided by user.


*METHOD*: POST

*URI*: https://uuzrahhut57jhz3sqxnddbrefq40ddjef.lambda-url.ap-south-1.on.aws/

*Required params*:  
data:  
    Email  
    Message  

*Sample Body*
```json
{
    "data": {
        "Email": "johndoe@example123.com",
        "Message": "Lorem ipsum"
    }
}
```

RESPONSE CODE: 200
Example Response:
```json
{
    "email": "johndoe@example123.com"
}
```

RESPONSE CODE: 400  
Request body is an improper `json` object.

