<?php
/**
 * The template for displaying all pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site may use a
 * different template.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package cityscapefountains
 */

get_header();
?>
<?php while ( have_posts() ) : the_post(); ?>

<main class="site-content site-content--cart">
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

  <section class="cart-section section--py">
    <div class="container">
    	<?php the_content(); ?>
    	</section>
</main>

<?php endwhile; ?>

<?php
get_footer();
