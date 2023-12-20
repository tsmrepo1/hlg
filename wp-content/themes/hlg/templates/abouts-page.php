<?php
/**
 * Template Name: About Us Page
*/
get_header();
while ( have_posts() ) : the_post();
?>
<main class="site-content site-content--about-us">
    <section class="pagetitle-section">
      <div class="pagetitle-section__top bg-light bg-center bg-cover bg-no-repeat"
        style="background-image: url(<?php bloginfo('template_directory'); ?>/assets/images/contact-us-pagetitle-bg.jpg)">
        <div class="container relative">
          <h1 class="pagetitle"><?php the_title(); ?></h1>
        </div>
      </div>
      <div class="pagetitle-section__bottom bg-primary">
        <div class="container">
          <nav class="w-full breadcrumb text-center">
            <ol class="list-reset inline-flex py-4 border-b border-b-borderColor">
              <li><a href="<?php the_permalink(); ?>">Home</a></li>
              <li><span class="mx-2">-</span></li>
              <li><?php the_title(); ?></li>
            </ol>
          </nav>
        </div>
      </div>
    </section>

    <!-- WHO WE ARE SECTION -->
    <section class="who-we-are-section section--py">
      <div class="container">
        <div class="grid grid-cols-12 gap-y-7 items-center">
          <?php if( get_field('who_we_are_image') ): ?>
          <div class="col-span-12 lg:col-span-6 text-center">
            <img src="<?php the_field('who_we_are_image'); ?>" alt="who we are" width="700" height="500" class="inline-block relative z-20 sm:w-1/2 lg:w-auto">
          </div>
          <?php endif; ?>
          <div class="col-span-12 lg:col-span-6 lg:pl-14 xl:pl-16">
            <?php if( get_field('who_we_are_title') ): ?>
            <h2
              class="section__heading text-white text-center bg-primary font-heading uppercase mb-10 lg:mb-14 xl:mb-20 2xl:mb-[6.25rem] py-7 lg:py-8 2xl:py-10 2xl:pl-40 2xl:pr-[5.625rem] rounded-[6.25rem] lg:w-[125%] lg:-translate-x-[35%]"><?php the_field('who_we_are_title'); ?></h2>
            <?php endif; ?>
            <?php if( get_field('who_we_are_content') ): ?>
            <div class="content-box content-box--text-dark">
              <?php the_field('who_we_are_content'); ?>
            </div>
            <?php endif; ?>
          </div>
        </div>
      </div>
    </section>

    <!-- STORY-MISSION SECTION -->
    <section class="story-section bg-light bg-center bg-cover bg-no-repeat" style="background-image: url(<?php bloginfo('template_directory'); ?>/assets/images/story-section-bg.jpg)">
      <div class="container relative lg:py-10 2xl:py-12">
        <div class="grid grid-cols-12 gap-y-7 lg:gap-x-8 items-center relative">
          <div class="col-span-12 lg:col-span-7 2xl:col-span-6">
            <div class="bg-light lg:bg-transparent py-8 px-4">
              <div class="grid grid-cols-12 gap-y-6 md:gap-x-7">
                <div class="col-span-12 md:col-span-6">
                  <div class="bg-white py-10 lg:py-[4.5rem] px-5 lg:px-8 rounded-2xl">
                    <h3 class="text-primary uppercase font-heading text-2xl lg:text-3xl mb-7 lg:mb-10 2xl:mb-14">
                      Our Story
                    </h3>
                    <?php if( get_field('our_story_content') ): ?>
                    <div class="content-box content-box--text-dark font-medium">
                      <p><?php the_field('our_story_content'); ?></p>
                    </div>
                    <?php endif; ?>
                    <div class="w-3/4 block bg-primary h-1 mt-7 lg:mt-10 2xl:mt-14">&nbsp;</div>
                  </div>
                </div>
                <div class="col-span-12 md:col-span-6">
                  <div class="bg-white py-10 lg:py-[4.5rem] px-5 lg:px-8 rounded-2xl">
                    <h3 class="text-primary uppercase font-heading text-2xl lg:text-3xl mb-7 lg:mb-10 2xl:mb-14">
                    Our Mission</h3>
                    <?php if( get_field('our_mission_content') ): ?>
                    <div class="content-box content-box--text-dark font-medium">
                      <p><?php the_field('our_mission_content'); ?></p>
                    </div>
                    <?php endif; ?>
                    <div class="w-3/4 block bg-primary h-1 mt-7 lg:mt-10 2xl:mt-14">&nbsp;</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-span-12 lg:col-span-5 2xl:col-span-6">
            <img src="<?php bloginfo('template_directory'); ?>/assets/images/story-col-img.png" alt="Our Story" class="w-full xl:scale-x-125">
          </div>
        </div>
      </div>
    </section>

    <!-- WHY CHOOSE US SECTION -->
    <section class="why-choose-us-section section--py">
      <div class="container">
        <h2
          class="section__heading text-center text-primary font-heading uppercase mb-10 lg:mb-14 xl:mb-20 2xl:mb-[6.25rem]">
          Why Choose Us</h2>
        <div class="grid grid-cols-12 gap-y-7 sm:gap-7">
          <?php
            while ( have_rows('why_choose_us_mangment') ) : the_row();
          ?>
          <div class="col-span-12 sm:col-span-6 lg:col-span-4">
            <div class="why-us-block">
              <?php if(!empty(get_sub_field('why_choose_us_image'))){ ?>
              <div class="why-us-block__header">
                <figure class="why-us-block__thumbnail aspect-square">
                  <img src="<?php echo get_sub_field('why_choose_us_image'); ?>" alt="Why choose us 1"
                    class="w-full h-full object-cover rounded-[2.5rem]">
                </figure>
              </div>
              <?php } ?>
              <div class="why-us-block__body pt-7 lg:pt-8 2xl:pt-10 relative">
                <?php if(!empty(get_sub_field('why_choose_us_title'))){ ?>
                <h4 class="text-2xl 2xl:text-3xl font-heading text-dark mb-4 lg:mb-5 2xl:mb-6"><?php echo get_sub_field('why_choose_us_title'); ?></h4>
                <?php } ?>
                <?php if(!empty(get_sub_field('why_choose_us_content'))){ ?>
                <p class="text-para font-medium line-clamp line-clamp--4"><?php echo get_sub_field('why_choose_us_content'); ?></p>
                <?php } ?>
              </div>
            </div>
          </div>
          <?php
            endwhile; 
          ?>
        </div>
      </div>
    </section>
  </main>
<?php
endwhile; // End of the loop.
get_footer();
