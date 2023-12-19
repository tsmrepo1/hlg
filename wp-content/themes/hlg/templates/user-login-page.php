<?php
/**
 * Template Name: User Login Page
*/
get_header();
do_action( 'woocommerce_before_customer_login_form' );


add_shortcode( 'wc_login_form_phpsof', 'phpsof_separate_login_form' );
  
function phpsof_separate_login_form() {
   if ( is_admin() ) return;
   if ( is_user_logged_in() ) return; 
   ob_start();
   woocommerce_login_form( array( 'redirect' => 'https://custom.url' ) );
   return ob_get_clean();
}




?>
<main class="site-content site-content--login"> 
<?php if ( 'yes' === get_option( 'woocommerce_enable_myaccount_registration' ) ) : ?>
<div class="u-columns col2-set" id="customer_login">
    <div class="u-column1 col-12">
<?php endif; ?>

<section class="user-action-section user-action-section--login section--pt section--pb-extra position-relative bg-light">
<div class="container">
    <div class="row justify-content-center">
        <div class="col-12 col-md-12 col-lg-4 col-xl-4 user-action-section__bg-block bg-primary">
        </div>
        <div class="col-12 col-md-9 col-lg-8 col-xl-6 bg-white ps-lg-0">
            <div class="forms-wrapper">
                <div class="form-container form-container--login mx-1 mx-md-0">
                    <div class="px-3 py-4 p-md-4 p-lg-5">
                        <h3 class="text-dark fw-bold mb-2 pt-3 pt-lg-0 text-center text-lg-start">Login</h3>
                            <!-- <p class="text-lightText mb-4 text-center text-lg-start" style="color: red; font-weight: bold;">Invalid Credentials </p> -->
                            <?php echo do_shortcode('[wc_login_form_phpsof]');?>
                            <p class="text-para text-center text-lg-start mt-3 mb-0 pb-3 pb-lg-0">Don't have an account? <a href="<?php echo site_url('/register'); ?>" class="btn--to-register fw-semibold text-decoration-underline text--highlight">Register Now</a> or <br>Forgot you password? <a href="<?php echo esc_url( wp_lostpassword_url() ); ?>">Click Here</a></p>
                    </div>
                </div>

                
            </div>
        </div>
    </div>
</div>
</section>
</main>
<?php
get_footer();
