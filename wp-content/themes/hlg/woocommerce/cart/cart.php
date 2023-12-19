<?php
/**
 * Cart Page
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/cart/cart.php.
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

defined( 'ABSPATH' ) || exit;

do_action( 'woocommerce_before_cart' ); ?>


<form class="woocommerce-cart-form" action="<?php echo esc_url( wc_get_cart_url() ); ?>" method="post">
<?php do_action( 'woocommerce_before_cart_table' ); ?>
<div class="cart-section__top">
<div class="cart-table">
  <div class="cart-table__header bg-primary text-white hidden md:block py-4">
    <div class="grid grid-cols-12 text-center">
      <div class="col-span-4 uppercase font-medium">Products</div>
      <div class="col-span-2 uppercase font-medium">Attributes</div>
      <div class="col-span-2 uppercase font-medium">Quantity</div>
      <div class="col-span-2 uppercase font-medium">Price</div>
      <div class="col-span-2 uppercase font-medium">Subtotal</div>
    </div>
  </div>
  <div class="cart-table__body">
    <ul class="items">

	<?php do_action( 'woocommerce_before_cart_contents' ); ?>

	<?php
	foreach ( WC()->cart->get_cart() as $cart_item_key => $cart_item ) {
	$_product   = apply_filters( 'woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key );
	$product_id = apply_filters( 'woocommerce_cart_item_product_id', $cart_item['product_id'], $cart_item, $cart_item_key );

	if ( $_product && $_product->exists() && $cart_item['quantity'] > 0 && apply_filters( 'woocommerce_cart_item_visible', true, $cart_item, $cart_item_key ) ) {
	$product_permalink = apply_filters( 'woocommerce_cart_item_permalink', $_product->is_visible() ? $_product->get_permalink( $cart_item ) : '', $cart_item, $cart_item_key );
	?>
      <li class="item <?php echo esc_attr( apply_filters( 'woocommerce_cart_item_class', 'cart_item', $cart_item, $cart_item_key ) ); ?>" >
        <div class="grid grid-cols-12 items-center">
          <div class="col-span-12 md:col-span-4">
            <div class="item__inner-wrap">
              <div class="item__heading">Products</div>
              <div class="item__data">
                <div class="flex flex-wrap space-y-2 lg:space-y-0 items-center justify-center">
                  <div class="w-full lg:w-4/12">
                    <div class="product-img w-20 h-20 inline-block">
                      <?php
						$thumbnail = apply_filters( 'woocommerce_cart_item_thumbnail', $_product->get_image(), $cart_item, $cart_item_key );

						if ( ! $product_permalink ) {
							echo $thumbnail; // PHPCS: XSS ok.
						} else {
							printf( '<a href="%s">%s</a>', esc_url( $product_permalink ), $thumbnail ); // PHPCS: XSS ok.
						}
						?>
                    </div>
                  </div>
                  <div class="w-full lg:w-5/12 product-content">
                    <?php
						if ( ! $product_permalink ) {
							echo wp_kses_post( apply_filters( 'woocommerce_cart_item_name', $_product->get_name(), $cart_item, $cart_item_key ) . '&nbsp;' );
						} else {
							echo wp_kses_post( apply_filters( 'woocommerce_cart_item_name', sprintf( '<a href="%s">%s</a>', esc_url( $product_permalink ), $_product->get_name() ), $cart_item, $cart_item_key ) );
						}

						do_action( 'woocommerce_after_cart_item_name', $cart_item, $cart_item_key );

						// Meta data.
						echo wc_get_formatted_cart_item_data( $cart_item ); // PHPCS: XSS ok.

						// Backorder notification.
						if ( $_product->backorders_require_notification() && $_product->is_on_backorder( $cart_item['quantity'] ) ) {
							echo wp_kses_post( apply_filters( 'woocommerce_cart_item_backorder_notification', '<p class="backorder_notification">' . esc_html__( 'Available on backorder', 'woocommerce' ) . '</p>', $product_id ) );
						}
						?>

                    <button class="text-red-600 underline mt-2 font-medium text-xs">
                    	<?php
								echo apply_filters( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
									'woocommerce_cart_item_remove_link',
									sprintf(
										'<a href="%s" class="remove" aria-label="%s" data-product_id="%s" data-product_sku="%s">&times;</a>',
										esc_url( wc_get_cart_remove_url( $cart_item_key ) ),
										esc_html__( 'Remove this item', 'woocommerce' ),
										esc_attr( $product_id ),
										esc_attr( $_product->get_sku() )
									),
									$cart_item_key
								);
							?>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-span-12 md:col-span-2">
            <div class="item__inner-wrap">
              <div class="item__heading">Attributes</div>
              <div class="item__data">
               <!--  <ul>
                  <li>Color: N/A</li>
                  <li>Quantity: 100ml</li>
                </ul> -->
              </div>
            </div>
          </div>
          <div class="col-span-12 md:col-span-2">
            <div class="item__inner-wrap">
              <div class="item__heading">Quantity</div>
              <div class="item__data">
				<td class="product-quantity" data-title="<?php esc_attr_e( 'Quantity', 'woocommerce' ); ?>">
				<?php
				if ( $_product->is_sold_individually() ) {
					$product_quantity = sprintf( '1 <input type="hidden" name="cart[%s][qty]" value="1" />', $cart_item_key );
				} else {
					$product_quantity = woocommerce_quantity_input(
						array(
							'input_name'   => "cart[{$cart_item_key}][qty]",
							'input_value'  => $cart_item['quantity'],
							'max_value'    => $_product->get_max_purchase_quantity(),
							'min_value'    => '0',
							'product_name' => $_product->get_name(),
						),
						$_product,
						false
					);
				}

				echo apply_filters( 'woocommerce_cart_item_quantity', $product_quantity, $cart_item_key, $cart_item ); // PHPCS: XSS ok.
				?>
				</td>
              </div>
            </div>
          </div>
          <div class="col-span-12 md:col-span-2">
            <div class="item__inner-wrap">
              <div class="item__heading">Price</div>
              <div class="item__data text-dark font-bold lg:text-lg xl:text-xl 2xl:text-2xl">
				<td class="product-price" data-title="<?php esc_attr_e( 'Price', 'woocommerce' ); ?>">
				<?php
					echo apply_filters( 'woocommerce_cart_item_price', WC()->cart->get_product_price( $_product ), $cart_item, $cart_item_key ); // PHPCS: XSS ok.
				?>
				</td>
              </div>
            </div>
          </div>
          <div class="col-span-12 md:col-span-2">
            <div class="item__inner-wrap no-border-before">
              <div class="item__heading">Subtotal</div>
              <div class="item__data text-dark font-bold lg:text-lg xl:text-xl 2xl:text-2xl">
				<td class="product-subtotal" data-title="<?php esc_attr_e( 'Subtotal', 'woocommerce' ); ?>">
					<?php
						echo apply_filters( 'woocommerce_cart_item_subtotal', WC()->cart->get_product_subtotal( $_product, $cart_item['quantity'] ), $cart_item, $cart_item_key ); // PHPCS: XSS ok.
					?>
				</td>
              </div>
            </div>
          </div>
        </div>
      </li>
<?php
	}
}
?>

      
    </ul>
  </div>
</div>
</div>		  
<div class="cart-section__middle border-t border-b border-borderColor py-12 lg:py-16 xl:py-24 2xl:py-32">
<div class="grid grid-cols-12 items-center gap-y-6 lg:gap-x-7">
	<?php do_action( 'woocommerce_cart_contents' ); ?>
  <div class="col-span-12 xl:col-span-6">
    <div class="flex flex-wrap items-center justify-center">
	<?php if ( wc_coupons_enabled() ) { ?>
	<div class="coupon">
	<label for="coupon_code"><?php esc_html_e( 'Coupon:', 'woocommerce' ); ?></label> <input type="text" name="coupon_code" class="input-text border py-2 px-3" id="coupon_code" value="" placeholder="<?php esc_attr_e( 'Coupon code', 'woocommerce' ); ?>" /> <button type="submit" class="btn btn-primary px-3 text-xs" name="apply_coupon" value="<?php esc_attr_e( 'Apply coupon', 'woocommerce' ); ?>"><?php esc_attr_e( 'Apply coupon', 'woocommerce' ); ?></button>
	<?php do_action( 'woocommerce_cart_coupon' ); ?>
	</div>
	<?php } ?>
    </div>
  </div>
  <div class="col-span-12 xl:col-span-6 text-center xl:text-right">
    <a href="<?php echo site_url('/shop'); ?>" class="btn btn-primary mr-3">Continue Shopping</a>
    <button type="submit" class="btn btn-dark-outline" name="update_cart" value="<?php esc_attr_e( 'Update cart', 'woocommerce' ); ?>"><?php esc_html_e( 'Update cart', 'woocommerce' ); ?></button>

	<?php do_action( 'woocommerce_cart_actions' ); ?>

	<?php wp_nonce_field( 'woocommerce-cart', 'woocommerce-cart-nonce' ); ?>

    <!-- <button class="btn btn-dark-outline">Clear Cart</button> -->
  </div>

</div>
</div>
<?php do_action( 'woocommerce_after_cart_contents' ); ?>
</tbody>
</table>
	<?php do_action( 'woocommerce_after_cart_table' ); ?>
</form>
<?php do_action( 'woocommerce_before_cart_collaterals' ); ?>
<div class="cart-section__bottom pt-12">
<div class="flex flex-wrap justify-center xl:justify-end">
  <div class="w-full md:w-8/12 lg:w-6/12 xl:w-5/12">
	<?php
	/**
	 * Cart collaterals hook.
	 *
	 * @hooked woocommerce_cross_sell_display
	 * @hooked woocommerce_cart_totals - 10
	 */
	do_action( 'woocommerce_cart_collaterals' );
	?>
	<!-- <div class="mt-5">
	<a href="checkout.html" class="btn btn-primary block w-full text-center">Proceed To Checkout</a>
	</div> -->
  </div>
</div>
</div>
