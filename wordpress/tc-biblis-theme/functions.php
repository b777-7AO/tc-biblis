<?php
// Cache-bust CSS/JS automatically from file modification time, so each deploy
// serves fresh assets without anyone having to bump a version number by hand.
add_action('wp_enqueue_scripts', function () {
  $css_path = get_theme_file_path('style.css');
  $js_path  = get_theme_file_path('assets/site.js');
  $cms_path = get_theme_file_path('assets/content.js');
  $css_ver  = file_exists($css_path) ? filemtime($css_path) : '1.0.1';
  $js_ver   = file_exists($js_path)  ? filemtime($js_path)  : '1.0.1';
  $cms_ver  = file_exists($cms_path) ? filemtime($cms_path) : '1.0.1';
  wp_enqueue_style('tc-biblis', get_stylesheet_uri(), array(), $css_ver);
  wp_enqueue_script('tc-biblis-site', get_theme_file_uri('assets/site.js'), array(), $js_ver, true);
  // CMS bridge: pulls Sveltia-committed JSON from the GitHub repo at runtime
  wp_enqueue_script('tc-biblis-content', get_theme_file_uri('assets/content.js'), array(), $cms_ver, true);
});

// Use the club logo as the browser/tab favicon (overrides the old uploads favicon).
add_action('wp_head', function () {
  $base = get_theme_file_uri('img');
  echo '<link rel="icon" type="image/png" sizes="32x32" href="' . esc_url($base . '/favicon-32.png') . '">' . "\n";
  echo '<link rel="apple-touch-icon" href="' . esc_url($base . '/logo-180.png') . '">' . "\n";
}, 5);
