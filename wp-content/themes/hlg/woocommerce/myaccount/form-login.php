<?php
/**
 * Login Form
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/myaccount/form-login.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see     https://docs.woocommerce.com/document/template-structure/
 * @package WooCommerce\Templates
 * @version 7.0.1
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
?>


<section class="section--py user-action-section user-action-section--login relative lg:my-[20] xl:my-[5.625rem]">
  <div class="container relative">
    <div class="grid grid-cols-12 items-center">
      <div class="col-span-12 lg:col-span-6 hidden lg:block">
        <div class="aspect-square bg-darkShade bg-center bg-cover bg-no-repeat rounded-[2rem]" style="background-image: url(<?php echo get_template_directory_uri();?>/assets/images/login-col-img.jpg)"></div>
      </div>
      <div class="col-span-12 lg:col-span-6">
        <div class="form-container bg-white z-10 md:mx-20 lg:mx-0">
          <h3 class="font-heading text-dark uppercase text-3xl text-center lg:text-left mb-4">Member Login</h3>
          <p class="text-dark font-medium text-center lg:text-left mb-1">Don't have any account? <a href="<?php echo site_url('/register'); ?>" class="underline font-medium text-primary hover:text-secondary">Create your free account
          </a></p>

	<form class="woocommerce-form woocommerce-form-login login form login-form my-8" method="post">
		<?php do_action( 'woocommerce_login_form_start' ); ?>
		<div class="form__field mb-5 xl:mb-6">
		<p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
		<label for="username"><?php esc_html_e( 'Email address', 'woocommerce' ); ?>&nbsp;<span class="required">*</span></label>
		<input type="text" class="form__input py-3 px-4" name="username" id="username" autocomplete="username" value="<?php echo ( ! empty( $_POST['username'] ) ) ? esc_attr( wp_unslash( $_POST['username'] ) ) : ''; ?>" />
		</p>
		</div>

        <div class="form__field mb-5">
		<p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
		<label for="password"><?php esc_html_e( 'Password', 'woocommerce' ); ?>&nbsp;<span class="required">*</span></label>
		<input class="form__input py-3 px-4" type="password" name="password" id="password" autocomplete="current-password" />
		</p>
		<?php do_action( 'woocommerce_login_form' ); ?>
            </div>

            <div class="form__field col-span-12 text-center lg:text-left">

		<p class="form-row">
		
		<?php wp_nonce_field( 'woocommerce-login', 'woocommerce-login-nonce' ); ?>
		<button type="submit" class="btn btn-primary" name="login" value="<?php esc_attr_e( 'Log in', 'woocommerce' ); ?>"><?php esc_html_e( 'Log in', 'woocommerce' ); ?></button>
		</p>
            </div>
          <?php do_action( 'woocommerce_login_form_end' ); ?>
          </form>
	<p class="woocommerce-LostPassword lost_password">
	<a href="<?php echo esc_url( wp_lostpassword_url() ); ?>"><?php esc_html_e( 'Lost your password?', 'woocommerce' ); ?></a>
	</p>
	<?php do_action( 'woocommerce_login_form_end' ); ?>
        </div>
      </div>
    </div>
  </div>
</section>
