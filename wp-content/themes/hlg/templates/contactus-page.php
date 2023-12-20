<?php
/**
 * Template Name: Contact Us Page
*/
get_header();
while ( have_posts() ) : the_post();
?>
<!-- SITE CONTENT -->
<main class="site-content site-content--contact-us">
  <section class="pagetitle-section">
    <div class="pagetitle-section__top bg-light bg-center bg-cover bg-no-repeat"
      style="background-image: url(<?php echo get_template_directory_uri();?>/assets/images/contact-us-pagetitle-bg.jpg)">
      <div class="container relative">
        <h1 class="pagetitle"><?php the_title(); ?></h1>
      </div>
    </div>
    <div class="pagetitle-section__bottom bg-primary">
      <div class="container">
        <nav class="w-full breadcrumb text-center">
          <ol class="list-reset inline-flex py-4 border-b border-b-borderColor">
            <li><a href="<?php echo home_url(); ?>">Home</a></li>
            <li><span class="mx-2">-</span></li>
            <li><?php the_title(); ?></li>
          </ol>
        </nav>
      </div>
    </div>
  </section>

  <section class="section--py contact-section">
    <div class="container relative lg:py-12">
      <div class="grid grid-cols-12 items-center rounded-3xl overflow-hidden shadow">
        <div class="col-span-12 lg:col-span-5 h-full">
          <div class="bg-primary px-4 py-8 md:p-10 lg:px-8 lg:py-12 2xl:px-8 2xl:py-14 h-full">

            <div class=" mb-10 lg:mb-12 2xl:mb-16">
              <ul>
                <?php if( get_field('email_address', 'options') ): ?>
                <li class="icon-block flex mb-6 lg:mb-8 xl:mb-10 2xl:mb-12 last:mb-0">
                  <div
                    class="w-12 h-12 border-2 border-white inline-flex items-center justify-center rounded-full flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-6">
                      <path
                        d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
                        class="fill-white" />
                    </svg>
                  </div>
                  <h6 class="text-white font-bold mt-2 md:text-lg lg:text-xl 2xl:text-2xl ml-3 lg:ml-4"><a
                      href="mailto:<?php the_field('email_address', 'options'); ?>"><?php the_field('email_address', 'options'); ?></a></h6>
                </li>
                <?php endif; ?>
                <?php if( get_field('address', 'options') ): ?>
                <li class="icon-block flex mb-6 lg:mb-8 xl:mb-10 2xl:mb-12 last:mb-0">
                  <div
                    class="w-12 h-12 border-2 border-white inline-flex items-center justify-center rounded-full flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="w-6">
                      <path
                        d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 256c-35.3 0-64-28.7-64-64s28.7-64 64-64s64 28.7 64 64s-28.7 64-64 64z"
                        class="fill-white" />
                    </svg>
                  </div>
                  <h6 class="text-white font-semibold mt-2 md:text-lg lg:text-xl 2xl:text-2xl ml-3 lg:ml-4"><?php the_field('address', 'options'); ?></h6>
                </li>
                <?php endif; ?>
                <?php if( get_field('phone_no', 'options') ): ?>
                <li class="icon-block flex mb-6 lg:mb-8 xl:mb-10 2xl:mb-12 last:mb-0">
                  <div
                    class="w-12 h-12 border-2 border-white inline-flex items-center justify-center rounded-full flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-6">
                      <path
                        d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"
                        class="fill-white" />
                    </svg>
                  </div>
                  
                  <h6 class="text-white font-semibold mt-2 md:text-lg lg:text-xl 2xl:text-2xl ml-3 lg:ml-4"><a
                      href="tel:<?php echo str_replace(array(" ","-"),'',get_field('phone_no',  'options')); ?>"><?php the_field('phone_no', 'options'); ?></a></h6>
                </li>
              <?php endif; ?>
              </ul>
            </div>
            <?php if( get_field('google_map_address', 'options') ): ?>
            <div class="map-container rounded-3xl overflow-hidden">
              <iframe src="<?php the_field('google_map_address', 'options'); ?>"
                width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
            <?php endif; ?>
          </div>
        </div>
        <div class="col-span-12 lg:col-span-7">
          <div class="form-container px-4 py-8 sm:px-6 md:p-8 lg:p-10 xl:pr-12 xl:p-12 2xl:p-16">
            <h2
              class="section__heading text-center text-primary font-heading uppercase mb-10 lg:mb-14 xl:mb-20 2xl:mb-[6.25rem]">
              Get In Touch</h2>
              <div class="form get-in-touch-form" id="getInTouchForm">
                <!-- <div class="grid grid-cols-12 gap-6 lg:gap-8 2xl:gap-12">
                  <div class="form__field col-span-12 md:col-span-6 lg:col-span-12 xl:col-span-6">
                    <input type="text" name="gitf_name" class="form__input px-4 py-4 2xl:py-5 2xl:px-5"
                      placeholder="Name*" required>
                  </div>

                  <div class="form__field col-span-12 md:col-span-6 lg:col-span-12 xl:col-span-6">
                    <input type="number" name="gitf_phone" class="form__input px-4 py-4 2xl:py-5 2xl:px-5"
                      placeholder="Phone*" required>
                  </div>

                  <div class="form__field col-span-12 md:col-span-6 lg:col-span-12 xl:col-span-6">
                    <input type="email" name="gitf_email" class="form__input px-4 py-4 2xl:py-5 2xl:px-5"
                      placeholder="Email*" required>
                  </div>

                  <div class="form__field col-span-12 md:col-span-6 lg:col-span-12 xl:col-span-6">
                    <input type="text" name="gitf_address" class="form__input px-4 py-4 2xl:py-5 2xl:px-5"
                      placeholder="Address*" required>
                  </div>

                  <div class="form__field col-span-12">
                    <textarea name="gitf_message" class="form__input px-4 py-4 2xl:py-5 2xl:px-5"
                      placeholder="Message"></textarea>
                  </div>
                </div>
                <div class="text-center mt-6 lg:mt-8 2xl:mt-12">
                  <button type="submit" class="btn btn-primary">Submit</button>
                </div> -->
                <?php echo do_shortcode('[contact-form-7 id="7" title="Get In Touch"]');?>                
              </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>
<?php
endwhile; // End of the loop.
get_footer();
