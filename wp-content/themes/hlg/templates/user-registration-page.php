<?php
/**
 * Template Name: User Registration Page
*/
get_header();
the_post()
?>
<?php
$error= '';
$success = '';

global $wpdb, $PasswordHash, $current_user, $user_ID;

if(isset($_POST['task']) && $_POST['task'] == 'register' ) {


    $password1 = $wpdb->escape(trim($_POST['password1']));
    $password2 = $wpdb->escape(trim($_POST['password2']));
    $first_name = $wpdb->escape(trim($_POST['first_name']));
    $last_name = $wpdb->escape(trim($_POST['last_name']));
    $email = $wpdb->escape(trim($_POST['email']));
    $username = $wpdb->escape(trim($_POST['username']));

    if( $email == "" || $password1 == "" || $password2 == "" || $username == "" || $first_name == "" || $last_name == "") {
        $error= 'Please don\'t leave the required fields.';
    } else if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error= 'Invalid email address.';
    } else if(email_exists($email) ) {
        $error= 'Email already exist.';
    } else if($password1 <> $password2 ){
        $error= 'Password do not match.';       
    } else {

        $user_id = wp_insert_user( array ('first_name' => apply_filters('pre_user_first_name', $first_name), 'last_name' => apply_filters('pre_user_last_name', $last_name), 'user_pass' => apply_filters('pre_user_user_pass', $password1), 'user_login' => apply_filters('pre_user_user_login', $username), 'user_email' => apply_filters('pre_user_user_email', $email), 'role' => 'subscriber' ) );
        if( is_wp_error($user_id) ) {
            $error= 'Error on user creation.';
        } else {
            do_action('user_register', $user_id);
            $success = 'You\'re successfully register';
        }

    }

}
?> <!-- SITE CONTENT -->
    <main class="site-content site-content--register">
      <section class="pagetitle-section">
        <div class="pagetitle-section__top bg-light bg-center bg-cover bg-no-repeat"
          style="background-image: url(<?php echo get_template_directory_uri();?>/assets/images/contact-us-pagetitle-bg.jpg)">
          <div class="container relative">
            <h1 class="pagetitle">Register</h1>
          </div>
        </div>
        <div class="pagetitle-section__bottom bg-primary">
          <div class="container">
            <nav class="w-full breadcrumb text-center">
              <ol class="list-reset inline-flex py-4 border-b border-b-borderColor">
                <li><a href="<?php echo home_url(); ?>">Home</a></li>
                <li><span class="mx-2">-</span></li>
                <li>Register</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      <section class="section--py user-action-section user-action-section--register relative lg:my-[20] xl:my-[5.625rem]">
        <div class="container relative">
          <div class="grid grid-cols-12 items-center">
            <div class="col-span-12 lg:col-span-6">
              <div class="form-container md:w-3/5 md:mx-auto lg:w-auto lg:pr-12 xl:pr-16 2xl:pr-20">
                <h3 class="font-heading text-primary uppercase text-3xl text-center lg:text-left lg:text-4xl 2xl:text-[2.5rem] mb-4">Create Your Free Account</h3>
                <p class="text-dark font-medium text-center lg:text-left mb-1">Already have an account? <a href="<?php echo site_url('/my-account'); ?>" class="underline font-medium text-primary hover:text-secondary">Sign in here</a></p>

                <form action="#" class="form register-form my-8" id="registerForm" method="post">
                <div class="row">
                    <div class="form__field mb-5">
                    <label>First Name*</label><input type="text" name="first_name" id="first_name" class="form__input py-3 px-4" required />
                </div>
                <div class="form__field mb-5">
                    <label>Last Name*</label> <input type="text" name="last_name" id="last_name" class="form__input py-3 px-4" required />
                </div>

                <div class="form__field mb-5">
                    <label>Email*</label><input type="email" name="email" id="email" class="form__input py-3 px-4" required />
                </div>
                </div>
                <div class="form__field mb-5">
                   <label>Username*</label><input type="text" name="username" id="username" class="form__input py-3 px-4" required />
                </div>
                <div class="form__field mb-5">
                    <label>Password*</label><input type="password" name="password1" id="password1" class="form__input py-3 px-4" required />
                </div>
                <div class="form__field mb-5">
                    <label>Confirm Password*</label><input type="password" name="password2" id="password2" class="form__input py-3 px-4" required  />
                </div>
                <div class="alignleft"><p><?php if(@$sucess != "") { echo $sucess; } ?> <?php if(@$error!= "") { echo $error; } ?></p></div>
                <button type="submit" class="btn btn-primary" name="register">Sign Up</button>
                <input type="hidden" name="task" value="register" />
                </form>
              </div>
            </div>
            <div class="col-span-12 lg:col-span-6 h-full hidden lg:block">
            <div class="h-full rounded-3xl bg-darkShade bg-center bg-cover bg-no-repeat" style="background-image: url(<?php echo get_template_directory_uri();?>/assets/images/register-col-img.jpg)"></div>
            </div>
          </div>
        </div>
      </section>
    </main>



























<?php
get_footer();
