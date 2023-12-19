<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/css/bootstrap.min.css'>
<title>404</title>
<style>
.wrap-error {
  background-color: #667bf2;
  
  background-attachment: fixed;
  background-size: cover;
  height: calc(var(--vh, 1vh) * 100);
}
.wrap-error h1 {
  font-size: 6.875rem;
  letter-spacing: -13px;
  line-height: 1;
  font-family: montserrat, sans-serif;
}
h1 span {
  text-shadow: -8px 0 0 rgb(102 123 242);
}
.text-9xl {
  font-size: 5.5rem;
}
</style>
</head>
<body>
<div class="wrap-error">
  <div class="d-flex align-items-center h-100">
    <div class="container">
      <div class="row">
        <div class="col-sm-8 offset-sm-2 text-center text-white">
          <h1 class=""><span>4</span><span>0</span><span>4</span></h1>
          <h5 class="">Oops! Page not found</h5>
          <p class="mb-4">we are sorry, but the page you requested was not found</p>
          <a href="<?php echo home_url(); ?>" class="btn btn-dark">Go home</a>
        </div>
      </div>
    </div>
  </div>
</div>
</body>
</html>
