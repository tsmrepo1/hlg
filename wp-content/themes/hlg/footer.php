<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package hlg
 */

?>
<!-- SITE FOOTER -->
<footer class="site-footer bg-[#1d1d1d]">
    <div class="py-[1.875rem] bg-primary">
      <div class="container">
        <div class="site-footer__menu-wrap text-center">
          <nav>
            <ul>
              <li>
                <a href="#">Alkaline Water Ionizers</a>
              </li>
              <li>
                <a href="#">Flexible Slar Panelas</a>
              </li>
              <li>
                <a href="#">Store (Everyyhing!)</a>
              </li>
              <li>
                <a href="#">Contact Us! </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <div class="pt-12 pb-11 -md:py-10">
      <div class="container">
        <div class="text-center max-w-[28.125rem] mx-auto">
          <div class="mb-8">
            <a href="index.html" class="inline-block w-24 lg:w-28 xl:w-32 2xl:w-36"><img src="<?php echo get_template_directory_uri();?>/assets/images/footer-logo.png" alt="footer logo" width="120" height="70" class="w-48 inline-block" /> </a>
          </div>

          <form action="#" class="form newsletter-form relative max-w-md mb-8" id="newsletterForm">
            <input type="email" name="nf_email" class="form__input pl-4 pr-10 py-4 2xl:py-5" placeholder="Your Email*" required />
            <button type="submit" class="btn btn-primary absolute top-0 right-0 rounded-md">Submit</button>
          </form>

          <ul class="social-icons inline-flex gap-x-6 -md:gap-x-4">
            <li>
              <a href="#" target="_blank" class="bg-primary text-dark">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="w-3">
                  <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                </svg>
              </a>
            </li>
            <li>
              <a href="#" target="_blank" class="bg-primary text-dark">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-4">
                  <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
                </svg>
              </a>
            </li>
            <li>
              <a href="#" target="_blank" class="bg-primary text-dark rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="w-4">
                  <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                </svg>
              </a>
            </li>
            <li>
              <a href="#" target="_blank" class="bg-primary text-dark rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="w-4">
                  <path d="M204 6.5C101.4 6.5 0 74.9 0 185.6 0 256 39.6 296 63.6 296c9.9 0 15.6-27.6 15.6-35.4 0-9.3-23.7-29.1-23.7-67.8 0-80.4 61.2-137.4 140.4-137.4 68.1 0 118.5 38.7 118.5 109.8 0 53.1-21.3 152.7-90.3 152.7-24.9 0-46.2-18-46.2-43.8 0-37.8 26.4-74.4 26.4-113.4 0-66.2-93.9-54.2-93.9 25.8 0 16.8 2.1 35.4 9.6 50.7-13.8 59.4-42 147.9-42 209.1 0 18.9 2.7 37.5 4.5 56.4 3.4 3.8 1.7 3.4 6.9 1.5 50.4-69 48.6-82.5 71.4-172.8 12.3 23.4 44.1 36 69.3 36 106.2 0 153.9-103.5 153.9-196.8C384 71.3 298.2 6.5 204 6.5z" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="pb-12 -md:pb-10">
      <div class="container">
        <div class="grid grid-cols-12 gap-5 items-center">
          <div class="col-span-12 lg:col-span-6 text-center lg:text-left">
            <div class="site-footer__bottom-menu-wrap">
              <nav>
                <ul class="inline-flex">
                  <li>
                    <a href="#">Privacy</a>
                  </li>

                  <li>
                    <a href="#">Terms</a>
                  </li>

                  <li>
                    <a href="#">Promo T&C Apply</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          <div class="col-span-12 lg:col-span-6 text-center lg:text-right">
            <p class="text-white -md:text-sm">© hlg | All Rights Reserved</p>
          </div>
        </div>
      </div>
    </div>

    <!-- SCROLL TOP BUTTON -->
    <button class="btn--scroll-top">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5">
        <path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" class="fill-white" />
      </svg>
    </button>

    <!-- CART BUTTON FOR MOBILE -->
    <button class="btn--show-cart-sm bottom-3 right-3 bg-dark bg-opacity-60 w-14 h-14" data-bs-toggle="offcanvas" href="#cartOffcanvas" role="button" aria-controls="cartOffcanvas">
      <div class="relative">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="23px" height="31px">
          <path fill-rule="evenodd" fill="rgb(113, 97, 208)" d="M0.690,29.893 C0.327,29.522 0.146,29.082 0.146,28.575 L0.146,7.950 C0.146,7.443 0.327,7.003 0.690,6.632 C1.053,6.261 1.482,6.075 1.979,6.075 L5.646,6.075 C5.684,4.513 6.238,3.185 7.307,2.091 C8.376,0.998 9.656,0.450 11.146,0.450 C12.636,0.450 13.915,0.998 14.984,2.091 C16.053,3.185 16.607,4.513 16.646,6.075 L20.313,6.075 C20.809,6.075 21.238,6.261 21.602,6.632 C21.964,7.003 22.146,7.443 22.146,7.950 L22.146,28.575 C22.146,29.082 21.964,29.522 21.602,29.893 C21.238,30.264 20.809,30.450 20.313,30.450 L1.979,30.450 C1.482,30.450 1.053,30.264 0.690,29.893 ZM1.979,7.950 L1.979,28.575 L20.313,28.575 L20.313,7.950 L1.979,7.950 ZM7.479,6.075 L14.813,6.075 C14.774,5.021 14.402,4.133 13.695,3.409 C12.988,2.687 12.139,2.325 11.146,2.325 C10.152,2.325 9.303,2.687 8.597,3.409 C7.889,4.133 7.517,5.021 7.479,6.075 L7.479,6.075 ZM7.737,11.437 C7.565,11.261 7.479,11.037 7.479,10.763 C7.479,10.490 7.565,10.265 7.737,10.089 C7.909,9.913 8.128,9.825 8.396,9.825 L13.896,9.825 C14.163,9.825 14.383,9.913 14.555,10.089 C14.727,10.265 14.813,10.490 14.813,10.763 C14.813,11.037 14.727,11.261 14.555,11.437 C14.383,11.612 14.163,11.700 13.896,11.700 L8.396,11.700 C8.128,11.700 7.909,11.612 7.737,11.437 Z" class="fill-white"></path>
        </svg>
        <span class="cart__item-count bg-primary rounded-full w-5 h-5 inline-flex items-center justify-center absolute -top-2 -right-2 text-white text-xs">0</span>
      </div>
    </button>
  </footer>

  <script src="https://code.jquery.com/jquery-3.1.0.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/jquery-validation@1.19.5/dist/jquery.validate.min.js"></script>
  <script src="<?php echo get_template_directory_uri();?>/assets/js/backend-script.js"></script>
<script defer src="<?php echo get_template_directory_uri();?>/assets/js/main.bundle.js"></script>
<?php wp_footer(); ?>
</body>
</html>
