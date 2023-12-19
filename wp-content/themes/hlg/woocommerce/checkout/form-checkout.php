<?php
/**
 * Checkout Form
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/checkout/form-checkout.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see https://docs.woocommerce.com/document/template-structure/
 * @package WooCommerce\Templates
 * @version 3.5.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

do_action( 'woocommerce_before_checkout_form', $checkout );

// If checkout registration is disabled and not logged in, the user cannot checkout.
if ( ! $checkout->is_registration_enabled() && $checkout->is_registration_required() && ! is_user_logged_in() ) {
	echo esc_html( apply_filters( 'woocommerce_checkout_must_be_logged_in_message', __( 'You must be logged in to checkout.', 'woocommerce' ) ) );
	return;
}
$user_id = is_user_logged_in();

?>

<section class="checkout-section section--py">
<div class="container">
	<form name="checkout" method="post" class="checkout woocommerce-checkout" action="<?php echo esc_url( wc_get_checkout_url() ); ?>" enctype="multipart/form-data">
  <div class="grid grid-cols-12 gap-y-7 lg:gap-x-8">
    <div class="col-span-12 lg:col-span-6 xl:col-span-7 order-2 lg:order-none">
      <div class="checkout-step checkout-step--login mb-5">
        <div class="checkout-step__header">
          <h4 class="text-dark text-lg lg:text-xl 2xl:text:2xl font-heading bg-light border-l-4 border-primary p-4 mb-1">Login Status</h4>
        </div>
        <div class="checkout-step__body px-4 py-8">
          <div class="login-status">
          	<?php if ( $user_id == '' ) { ?>
            <h6 class="text-dark font-medium flex items-center login-status--error">
              <span
                ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5"><path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-144c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z" class="fill-info" /></svg
              ></span>
              <span class="ml-3">You are not logged in. Please go to <a href="<?php echo site_url('/my-account'); ?>" class="text-primary underline">Login</a></span>
            </h6>
            <?php } else{ ?>

            <h6 class="text-dark font-medium flex items-center login-status--successful">
              <span
                ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5"><path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" class="fill-success" /></svg
              ></span>
              <span class="ml-3">You are logged in.</span>
            </h6>
            <?php }?>
          </div>
        </div>
      </div>

      <div class="checkout-step checkout-step--address mb-5">
        <div class="checkout-step__header">
          <h4 class="text-dark text-lg lg:text-xl 2xl:text:2xl font-heading bg-light border-l-4 border-primary p-4">Add Address</h4>
        </div>
        <div class="checkout-step__body px-4 py-8">
          <div class="address-block">			

			<?php if ( $checkout->get_checkout_fields() ) : ?>

			<?php do_action( 'woocommerce_checkout_before_customer_details' ); ?>
			
				<?php do_action( 'woocommerce_checkout_billing' ); ?>
			
				<?php do_action( 'woocommerce_checkout_shipping' ); ?>

			<?php do_action( 'woocommerce_checkout_after_customer_details' ); ?>

			<?php endif; ?>
           
          </div>
        </div>
      </div>     

      <!-- <div class="checkout-step">
        <button class="btn btn-primary block w-full">Place Order</button>
      </div> -->
    </div>
    
    <div class="col-span-12 lg:col-span-6 xl:col-span-5 order-1 lg:order-none">
      <div class="order-summary bg-primary rounded-custom-lg py-8 px-4 md:p-8 xl:p-14 2xl:p-20">
         <?php do_action( 'woocommerce_checkout_before_order_review_heading' ); ?>

			<h3 id="order_review_heading"><?php esc_html_e( 'Your order', 'woocommerce' ); ?></h3>

			<?php do_action( 'woocommerce_checkout_before_order_review' ); ?>

			<div id="order_review" class="woocommerce-checkout-review-order">
			<?php do_action( 'woocommerce_checkout_order_review' ); ?>
			</div>

			<?php do_action( 'woocommerce_checkout_after_order_review' ); ?>
      </div>
    </div>
  </div>
  </form>
</div>
</section>
