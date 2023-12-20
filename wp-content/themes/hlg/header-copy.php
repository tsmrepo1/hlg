<header class="site-header sticky top-0" id="siteHeader">
<div class="site-header__inner-wraper bg-white py-3 lg:py-5 2xl:py-6">
  <div class="container relative">
    <div class="flex justify-between items-center">
      <!-- NAV TOGGLER BUTTON -->
      <div class="inline-flex justify-between items-center w-full lg:w-auto">
        <button class="site-header__btn--nav-toggler lg:mr-3 text-2xl text-dark inline-block xl:hidden"
          type="button" data-bs-toggle="offcanvas" data-bs-target="#navOffcanvas" aria-controls="navOffcanvas">
          <span class="block w-7 h-0.5 bg-dark mb-2 last:mb-0"></span>
          <span class="block w-7 h-0.5 bg-dark mb-2 last:mb-0"></span>
          <span class="block w-7 h-0.5 bg-dark mb-2 last:mb-0"></span>
        </button>

        <!-- LOGO -->
        <a href="<?php echo home_url(); ?>" class="inline-block site-header__logo relative">
        <?php
        $custom_logo_id = get_theme_mod( 'custom_logo' );
        $logo = wp_get_attachment_image_src( $custom_logo_id , 'full' );

        if ( has_custom_logo() ) {
          echo '<img src="' . esc_url( $logo[0] ) . '" alt="' . get_bloginfo( 'name' ) . '" alt="logo" width="120" height="70" class="w-24 md:w-28 xl:w-32 2xl:w-36 lg:px-4 relative z-20">';
        } else {
          echo '<h1>' . get_bloginfo('name') . '</h1>';
        }
        ?>
        </a>

        <button type="button" class="site-header__btn--search lg:hidden" data-bs-toggle="offcanvas"
          href="#searchOffcanvas" role="button" aria-controls="searchOffcanvas">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="w-7 h-7">
            <path fill-rule="evenodd" fill="rgb(113, 97, 208)"
              d="M25.838,10.946 C25.838,13.941 24.817,16.500 22.778,18.623 C20.738,20.748 18.280,21.810 15.404,21.810 C12.963,21.810 10.772,21.009 8.833,19.407 L1.961,26.562 C1.760,26.806 1.500,26.928 1.183,26.928 C0.865,26.928 0.597,26.814 0.380,26.589 C0.162,26.362 0.054,26.083 0.054,25.753 C0.054,25.421 0.171,25.152 0.405,24.943 L7.278,17.788 C5.739,15.769 4.970,13.488 4.970,10.946 C4.970,7.952 5.990,5.393 8.030,3.268 C10.070,1.145 12.528,0.083 15.404,0.083 C18.280,0.083 20.738,1.145 22.778,3.268 C24.817,5.393 25.838,7.952 25.838,10.946 ZM24.233,10.946 C24.233,8.405 23.371,6.237 21.649,4.444 C19.926,2.650 17.845,1.753 15.404,1.753 C12.963,1.753 10.881,2.650 9.159,4.444 C7.436,6.237 6.575,8.405 6.575,10.946 C6.575,13.488 7.436,15.655 9.159,17.449 C10.881,19.242 12.963,20.138 15.404,20.138 C17.845,20.138 19.926,19.242 21.649,17.449 C23.371,15.655 24.233,13.488 24.233,10.946 Z"
              class="fill-dark"></path>
          </svg>
        </button>
      </div>


      <!-- MAIN NAVIGATION -->
      <nav class="site-header__nav text-center hidden xl:inline-block xl:px-5 2xl:px-8">
        <ul class="nav-menu inline-flex items-center">
          <li class="xl:mr-4 2xl:mr-5">
            <a href="<?php echo home_url(); ?>">Home</a>
          </li>
          <li class="xl:mr-4 2xl:mr-5">
            <a href="<?php echo site_url('/about-us'); ?>">About Us</a>
          </li>
          <li class="xl:mr-4 2xl:mr-5">
            <a href="<?php echo site_url('/shop'); ?>">Store (Everyyhing!)</a>
          </li>
          <li class="xl:mr-4 2xl:mr-5">
            <a href="<?php echo site_url('/blog'); ?>">Blogs</a>
          </li>
          <li class="xl:mr-4 2xl:mr-5">
            <a href="<?php echo site_url('/contact-us'); ?>">Contact Us!</a>
          </li>
        </ul>
      </nav>

      <!-- SITE HEADER CTA BUTTONS -->
      <div class="inline-flex items-center">
        <!-- SEARCH FORM FOR LARGE SCREEN -->
        <!-- <form action="#" class="form search-form relative hidden lg:inline-block lg:mx-5 2xl:mx-8">
          <input type="text" name="sf_inp" class="form__input py-3 pl-3 pr-7 text-sm" placeholder="Search..."
            required />
          <button type="submit" class="absolute top-2.5 right-3">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="w-8 h-8">
              <path fill-rule="evenodd" fill="rgb(113, 97, 208)"
                d="M25.838,10.946 C25.838,13.941 24.817,16.500 22.778,18.623 C20.738,20.748 18.280,21.810 15.404,21.810 C12.963,21.810 10.772,21.009 8.833,19.407 L1.961,26.562 C1.760,26.806 1.500,26.928 1.183,26.928 C0.865,26.928 0.597,26.814 0.380,26.589 C0.162,26.362 0.054,26.083 0.054,25.753 C0.054,25.421 0.171,25.152 0.405,24.943 L7.278,17.788 C5.739,15.769 4.970,13.488 4.970,10.946 C4.970,7.952 5.990,5.393 8.030,3.268 C10.070,1.145 12.528,0.083 15.404,0.083 C18.280,0.083 20.738,1.145 22.778,3.268 C24.817,5.393 25.838,7.952 25.838,10.946 ZM24.233,10.946 C24.233,8.405 23.371,6.237 21.649,4.444 C19.926,2.650 17.845,1.753 15.404,1.753 C12.963,1.753 10.881,2.650 9.159,4.444 C7.436,6.237 6.575,8.405 6.575,10.946 C6.575,13.488 7.436,15.655 9.159,17.449 C10.881,19.242 12.963,20.138 15.404,20.138 C17.845,20.138 19.926,19.242 21.649,17.449 C23.371,15.655 24.233,13.488 24.233,10.946 Z"
                class="fill-primary" />
            </svg>
          </button>
        </form> -->
        <?php echo do_shortcode('[fibosearch class="large_form"]'); ?>

        <div class="site-header__btn--my-account hidden lg:inline-flex justify-center mr-4 2xl:mr-6">
          <div>
            <div class="dropdown relative">
              <button class="dropdown-toggle flex items-center" type="button" id="dropdownMenuButton1tx"
                data-bs-toggle="dropdown" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25px"
                  height="33px">
                  <path fill-rule="evenodd" fill="rgb(113, 97, 208)"
                    d="M22.392,32.802 C22.221,29.570 21.238,26.825 19.381,24.446 C17.471,21.999 15.372,20.809 12.963,20.809 C10.555,20.809 8.456,21.999 6.546,24.446 C4.689,26.825 3.705,29.570 3.534,32.802 L0.969,32.802 C1.149,28.972 2.331,25.635 4.542,22.803 C6.948,19.720 9.755,18.179 12.963,18.179 C16.171,18.179 18.979,19.720 21.385,22.803 C23.596,25.635 24.778,28.972 24.958,32.802 L22.392,32.802 ZM18.039,13.516 C16.610,14.980 14.918,15.712 12.963,15.712 C11.008,15.712 9.316,14.980 7.888,13.516 C6.459,12.052 5.745,10.318 5.745,8.314 C5.745,6.310 6.459,4.576 7.888,3.112 C9.316,1.647 11.008,0.915 12.963,0.915 C14.918,0.915 16.610,1.647 18.039,3.112 C19.468,4.576 20.182,6.310 20.182,8.314 C20.182,10.318 19.468,12.052 18.039,13.516 ZM16.224,4.972 C15.275,3.999 14.239,3.546 12.963,3.546 C11.688,3.546 10.652,3.999 9.703,4.972 C8.753,5.945 8.311,7.007 8.311,8.314 C8.311,9.621 8.753,10.683 9.703,11.656 C10.652,12.629 11.688,13.082 12.963,13.082 C14.239,13.082 15.275,12.629 16.224,11.656 C17.173,10.683 17.615,9.621 17.615,8.314 C17.615,7.007 17.173,5.945 16.224,4.972 Z"
                    class="fill-primary" />
                </svg>
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-down" class="w-2 ml-2"
                  role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <path fill="currentColor"
                    d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z">
                  </path>
                </svg>
              </button>
              <ul class="dropdown-menu min-w-[180px]" aria-labelledby="dropdownMenuButton1tx">
                <?php 
                  if ( is_user_logged_in() ) {
                  wp_get_current_user();
                  $useremail = $current_user->user_email;
                  $username = $current_user->user_login;
                  $firstname = $current_user->user_firstname;
                  $lastname = $current_user->user_lastname;
                ?>
                <div class="flex items-center p-3">
                    <div class="w-3/4">
                      <p class="text-sm text-dark"><?php echo $username; ?></p>
                      <p class="text-xs text-dark"><?php echo $useremail;  ?></p>
                    </div>                   
                  </div>
                <?php } ?>
                <?php if ( is_user_logged_in() ) { ?>
                  <li>
                    <a class="dropdown-item text-sm py-2 px-3" href="<?php echo site_url('/my-account'); ?>">My Account</a>
                  </li>
                  <li>
                    <a class="dropdown-item text-sm py-2 px-3 btn--logout" href="<?php echo wp_logout_url( home_url()); ?>">Logout</a>
                  </li>
                <?php } else{ ?>
                <li><a class="dropdown-item text-sm py-2 px-3 btn--logout" href="<?php echo site_url('/my-account'); ?>">Login</a></li>
                <?php } ?>
              </ul>
            </div>
          </div>
        </div>
        <?php $items_count = WC()->cart->get_cart_contents_count(); ?>
        <button class="site-header__btn--cart relative hidden lg:inline-block mr-4 2xl:mr-6"
          data-bs-toggle="offcanvas" href="#cartOffcanvas" role="button" aria-controls="cartOffcanvas">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="23px"
            height="31px">
            <path fill-rule="evenodd" fill="rgb(113, 97, 208)"
              d="M0.690,29.893 C0.327,29.522 0.146,29.082 0.146,28.575 L0.146,7.950 C0.146,7.443 0.327,7.003 0.690,6.632 C1.053,6.261 1.482,6.075 1.979,6.075 L5.646,6.075 C5.684,4.513 6.238,3.185 7.307,2.091 C8.376,0.998 9.656,0.450 11.146,0.450 C12.636,0.450 13.915,0.998 14.984,2.091 C16.053,3.185 16.607,4.513 16.646,6.075 L20.313,6.075 C20.809,6.075 21.238,6.261 21.602,6.632 C21.964,7.003 22.146,7.443 22.146,7.950 L22.146,28.575 C22.146,29.082 21.964,29.522 21.602,29.893 C21.238,30.264 20.809,30.450 20.313,30.450 L1.979,30.450 C1.482,30.450 1.053,30.264 0.690,29.893 ZM1.979,7.950 L1.979,28.575 L20.313,28.575 L20.313,7.950 L1.979,7.950 ZM7.479,6.075 L14.813,6.075 C14.774,5.021 14.402,4.133 13.695,3.409 C12.988,2.687 12.139,2.325 11.146,2.325 C10.152,2.325 9.303,2.687 8.597,3.409 C7.889,4.133 7.517,5.021 7.479,6.075 L7.479,6.075 ZM7.737,11.437 C7.565,11.261 7.479,11.037 7.479,10.763 C7.479,10.490 7.565,10.265 7.737,10.089 C7.909,9.913 8.128,9.825 8.396,9.825 L13.896,9.825 C14.163,9.825 14.383,9.913 14.555,10.089 C14.727,10.265 14.813,10.490 14.813,10.763 C14.813,11.037 14.727,11.261 14.555,11.437 C14.383,11.612 14.163,11.700 13.896,11.700 L8.396,11.700 C8.128,11.700 7.909,11.612 7.737,11.437 Z"
              class="fill-primary" />
          </svg>
          <span
            class="cart__item-count bg-dark rounded-full w-5 h-5 inline-flex items-center justify-center absolute -top-2 -right-2 text-white text-xs"><?php echo $items_count; ?></span>
        </button>

        <?php if ( is_user_logged_in() ) { ?>
        <a href="<?php echo site_url('/my-account/wishlist/'); ?>" class="site-header__btn--wishlist relative hidden lg:inline-block">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30px"
            height="26px">
            <path fill-rule="evenodd" fill="rgb(113, 97, 208)"
              d="M29.396,8.958 L29.396,9.016 L29.396,9.075 C29.396,9.115 29.386,9.173 29.368,9.251 C29.348,9.330 29.339,9.388 29.339,9.427 C29.301,11.029 28.990,12.561 28.405,14.026 C27.819,15.491 27.121,16.761 26.309,17.835 C25.497,18.910 24.534,19.915 23.421,20.852 C22.306,21.790 21.296,22.552 20.390,23.138 C19.484,23.724 18.540,24.260 17.558,24.749 C16.576,25.237 15.916,25.540 15.576,25.657 C15.236,25.774 14.971,25.872 14.783,25.950 C14.593,25.872 14.330,25.764 13.990,25.628 C13.650,25.491 12.999,25.189 12.036,24.720 C11.073,24.251 10.147,23.724 9.260,23.138 C8.373,22.552 7.382,21.781 6.287,20.823 C5.191,19.866 4.238,18.860 3.426,17.805 C2.614,16.751 1.925,15.491 1.359,14.026 C0.793,12.561 0.490,11.029 0.453,9.427 C0.453,9.388 0.443,9.330 0.424,9.251 C0.405,9.173 0.396,9.115 0.396,9.075 L0.396,9.016 C0.396,8.978 0.396,8.939 0.396,8.899 C0.433,6.595 1.255,4.573 2.860,2.835 C4.464,1.097 6.362,0.228 8.552,0.228 C11.120,0.228 13.234,1.380 14.896,3.685 C16.557,1.380 18.672,0.228 21.240,0.228 C23.429,0.228 25.327,1.097 26.932,2.835 C28.537,4.573 29.358,6.595 29.396,8.899 L29.396,8.958 ZM27.584,9.075 C27.584,9.037 27.584,8.997 27.584,8.958 C27.546,7.083 26.904,5.472 25.658,4.124 C24.412,2.776 22.939,2.103 21.240,2.103 C19.276,2.103 17.652,3.002 16.369,4.798 C15.991,5.306 15.500,5.560 14.896,5.560 C14.292,5.560 13.800,5.306 13.423,4.798 C12.139,3.002 10.515,2.103 8.552,2.103 C6.853,2.103 5.380,2.776 4.134,4.124 C2.888,5.472 2.246,7.083 2.209,8.958 C2.209,8.997 2.209,9.037 2.209,9.075 C2.246,9.154 2.265,9.232 2.265,9.310 C2.302,11.029 2.699,12.670 3.455,14.231 C4.210,15.794 5.069,17.083 6.032,18.098 C6.995,19.115 8.118,20.072 9.402,20.970 C10.685,21.869 11.724,22.513 12.517,22.903 C13.310,23.294 14.065,23.646 14.783,23.958 C15.500,23.646 16.264,23.294 17.077,22.903 C17.888,22.513 18.946,21.869 20.249,20.970 C21.551,20.072 22.693,19.115 23.675,18.098 C24.657,17.083 25.535,15.794 26.309,14.231 C27.083,12.670 27.489,11.048 27.527,9.368 C27.527,9.251 27.546,9.154 27.584,9.075 L27.584,9.075 Z"
              class="fill-primary" />
          </svg>
          <span
            class="wishlist__item-count bg-dark rounded-full w-5 h-5 inline-flex items-center justify-center absolute -top-2 -right-3 text-white text-xs"><?php echo do_shortcode('[ti_wishlist_products_counter]'); ?></span>
        </a>
        <?php } ?>
      </div>
    </div>
  </div>
</div>

<!-- MOBILE NAV OFFCANVAS -->
<div class="offcanvas offcanvas-start fixed top-0 left-0 bottom-0 bg-primary" tabindex="-1" id="navOffcanvas"
  aria-labelledby="navOffcanvasLabel">
  <div class="offcanvas-header flex items-center justify-between p-4">
    <h5 class="offcanvas-title mb-0 leading-normal font-semibold" id="offcanvasExampleLabel"></h5>
    <button type="button" class="btn-close brightness-0 invert" data-bs-dismiss="offcanvas"
      aria-label="Close"></button>
  </div>
  <div class="offcanvas-body flex-grow p-4 overflow-y-auto">
    <nav class="site-header__mobile-nav mt-14">
      <ul class="nav-menu">
          <li class="mb-3 last:mb-0">
            <a href="<?php echo home_url(); ?>">Home</a>
          </li>
          <li class="mb-3 last:mb-0">
            <a href="<?php echo site_url('/about-us'); ?>">About Us</a>
          </li>
          <li class="mb-3 last:mb-0">
            <a href="<?php echo site_url('/shop'); ?>">Store (Everyyhing!)</a>
          </li>
          <li class="mb-3 last:mb-0">
            <a href="<?php echo site_url('/blog'); ?>">Blogs</a>
          </li>
          <li class="mb-3 last:mb-0">
            <a href="<?php echo site_url('/contact-us'); ?>">Contact Us!</a>
          </li>
      </ul>
    </nav>
  </div>
</div>

<!-- CART OFFCANVAS -->
<div class="offcanvas offcanvas-end fixed top-0 right-0 bottom-0 bg-white" tabindex="-1" id="cartOffcanvas"
  aria-labelledby="cartOffcanvasLabel">
  <div class="offcanvas-header flex items-center justify-between p-4">
    <h5 class="offcanvas-title mb-0 leading-normal font-semibold text-dark text-xl lg:text-2xl">My Cart</h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body flex-grow p-4 overflow-y-auto">
    <ul class="offcanvas-cart-table pb-3">
      <?php
        foreach ( WC()->cart->get_cart() as $cart_item_key => $cart_item ) {
        $_product   = apply_filters( 'woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key );
        $product_id = apply_filters( 'woocommerce_cart_item_product_id', $cart_item['product_id'], $cart_item, $cart_item_key );

        if ( $_product && $_product->exists() && $cart_item['quantity'] > 0 && apply_filters( 'woocommerce_cart_item_visible', true, $cart_item, $cart_item_key ) ) {
        $product_permalink = apply_filters( 'woocommerce_cart_item_permalink', $_product->is_visible() ? $_product->get_permalink( $cart_item ) : '', $cart_item, $cart_item_key );
        ?>
        <li class="flex order-item space-x-2 mb-3 last:mb-0">
          <div class="w-3/12">
            <?php
            $thumbnail = apply_filters( 'woocommerce_cart_item_thumbnail', $_product->get_image(), $cart_item, $cart_item_key );

            if ( ! $product_permalink ) {
              echo $thumbnail; // PHPCS: XSS ok.
            } else {
              printf( '<a href="%s">%s</a>', esc_url( $product_permalink ), $thumbnail ); // PHPCS: XSS ok.
            }
            ?>
          </div>
          <div class="w-6/12">
            <div class="order-item__title mb-2">
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
            </div>
            <div class="order-item__cta flex items-center pt-1">
              <?php
              if ( $_product->is_sold_individually() ) {
              $min_quantity = 1;
              $max_quantity = 1;
              } else {
              $min_quantity = 0;
              $max_quantity = $_product->get_max_purchase_quantity();
              }
              $product_quantity = woocommerce_quantity_input(
              array(
                'input_name'   => "cart[{$cart_item_key}][qty]",
                'input_value'  => $cart_item['quantity'],
                'max_value'    => $max_quantity,
                'min_value'    => $min_quantity,
                'product_name' => $_product->get_name(),
              ),
              $_product,
              false
              );
              echo apply_filters( 'woocommerce_cart_item_quantity', $product_quantity, $cart_item_key, $cart_item ); // PHPCS: XSS ok.
              ?>
              <?php
                echo apply_filters( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                  'woocommerce_cart_item_remove_link',
                  sprintf(
                    '<a href="%s" class="order-item__btn--remove d-inlie-block" aria-label="%s" data-product_id="%s" data-product_sku="%s">&times;</a>',
                    esc_url( wc_get_cart_remove_url( $cart_item_key ) ),
                    esc_html__( 'Remove this item', 'woocommerce' ),
                    esc_attr( $product_id ),
                    esc_attr( $_product->get_sku() )
                  ),
                  $cart_item_key
                );
              ?>
            </div>
          </div>
          <div class="w-3/12 text-right">
            <p class="text-dark order-item__price font-medium">
            <?php
            echo apply_filters( 'woocommerce_cart_item_price', WC()->cart->get_product_price( $_product ), $cart_item, $cart_item_key ); // PHPCS: XSS ok.
            ?>
            </p>
          </div>
        </li>



        <?php
        }
        }
        ?>
    </ul>

    <div class="offcanvas-cart__total border-t border-t-borderColor pt-3">
      <div class="flex mb-6">
        <div class="w-6/12">
          <p class="text-dark font-semibold">Subtotal</p>
        </div>
        <div class="w-6/12">
          <p class="text-dark font-bold text-end"><?php wc_cart_totals_subtotal_html(); ?></p>
        </div>
      </div>
      <div class="flex bg-light border border-borderColor rounded-custom-lg py-5 px-4">
        <div class="w-6/12">
          <p class="text-dark font-semibold">Total</p>
        </div>
        <div class="w-6/12 text-end">
          <p class="text-dark font-bold"><?php wc_cart_totals_order_total_html(); ?></p>
        </div>
      </div>
    </div>
  </div>
  <div class="offcanvas-footer flex sticky bottom-0">
    <!-- <a href="cart.html" class="w-1/2 bg-light text-dark py-3 text-center text-sm font-semibold uppercase">View
      Cart</a>
    <a href="checkout.html"
      class="w-1/2 bg-primary text-white py-3 text-center text-sm font-semibold uppercase">Proceed To Checkout</a> -->

    <a href="<?php echo site_url('/cart'); ?>" class="w-1/2 bg-light text-dark py-3 text-center text-sm font-semibold uppercase">View Cart</a>
    <a href="<?php echo esc_url( wc_get_checkout_url() ); ?>" class="w-1/2 bg-primary text-white py-3 text-center text-sm font-semibold uppercase<?php echo esc_attr( wc_wp_theme_get_element_class_name( 'button' ) ? ' ' . wc_wp_theme_get_element_class_name( 'button' ) : '' ); ?>">
    <?php esc_html_e( 'Proceed to checkout', 'woocommerce' ); ?>
    </a>


  </div>
</div>
<!-- SEARCH OFFCANVAS -->
  <div class="offcanvas offcanvas-top fixed top-0 right-0 bottom-0 bg-white w-full max-h-full offcanvas--search" tabindex="-1" id="searchOffcanvas" aria-labelledby="searchOffcanvasLabel">
    <div class="offcanvas-body flex-grow p-4 overflow-y-auto">
      <?php echo do_shortcode('[fibosearch class="mobile_form"]'); ?>
    </div>
  </div>
</header>