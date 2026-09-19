Errors: 
Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
Type 'undefined' is not assignable to type 'string'.
Solution: We need to use the fallback of every possible case. So, there will not be a blocker for the entire process. JUST A TYPESCRIPT ERROR.


Errors:
LOGIN & REGISTER API'S
There are few cases which were breaking the api's error section. 
Case 1: When a input parameter is missing the feild name should be visible but is is empty. 
Case 2: When user account is in "SUSPENED"/"BLOCKED" or if that user credintinals are not matching then there are two error's which were establizhed but not working. 

I have found out the bug it is inside the validate function. The validate is not sat perfeectly for validating. It should have global standards that any input parameters should come it's should handle that one. 

formattedErrors:- [
  {
    field: '',
    message: 'Invalid input: expected string, received undefined'
  }
]
Errors inside:- ZodError: [
  {
    "expected": "string",
    "code": "invalid_type",
    "path": [
      "password"
    ],
    "message": "Invalid input: expected string, received undefined"
  }
]
The issue is been solved. The middele ware which we are using that need's to be only parse of body & there were few correction inside the schema which we have to look into that in further process.

We have intergrated the AWS services inside the code. S3, SQS, lambda... Until now but we are going to integrate more ike sns VPA...
For any AWS service to be integrated we need permission which will eat all of your time. S3 full access, Lambda Full access, sq full access. One more thing to keep in mind that is when you give the permision to the IAM Role user need to give the permission to that role that excute permission. Other wise he will not be able to connect between services and also give him all the permission related which i have been listed inside this SQSlambdaRolePermission policy. 

