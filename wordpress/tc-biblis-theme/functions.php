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

// ---------------------------------------------------------------------------
// SEO layer (added 19.10.2026): titles, meta descriptions, canonical, Open Graph,
// JSON-LD for the club, noindex for thin archives, slimmer sitemap, no emoji JS.
// ---------------------------------------------------------------------------
function tcb_page_descriptions() {
  return array(
    'front'         => 'TC Biblis 1973 e.V.: Tennisclub mit 7 Sandplätzen, moderner 3-Feld-Tennishalle und Clubhaus. Mannschafts-, Jugend- und Breitensport in Biblis.',
    'anlage'        => 'Die Anlage des TC Biblis: 7 Freiplätze, moderne 3-Feld-Tennishalle und Clubhaus mit Gaststätte in der Josef-Seib-Straße 7-9, 68647 Biblis.',
    'tennishalle'   => 'Die 3-Feld-Tennishalle des TC Biblis mit Premium-Teppichboden: Hallenpreise ab Oktober 2026, Online-Buchung und Wingfield-Spielanalyse.',
    'training'      => 'Training beim TC Biblis: Gruppen- und Einzeltraining, Kids Club und Schnuppertraining mit unserem Trainerteam rund um Cheftrainerin Antonela Timmerbeil.',
    'jugend'        => 'Jugendtennis beim TC Biblis: Kids Club, strukturiertes Training, Kennenlernwochen und Events. Tennis von klein auf, gefördert von regionalen Partnern.',
    'mannschaften'  => 'Mannschaften des TC Biblis: Medenspiele, Hobbyrunde und Winterpokal. Wettkampftennis für jede Altersklasse.',
    'vorstand'      => 'Der Vorstand des TC Biblis 1973 e.V.: Ansprechpartner für Verein, Finanzen, Sport, Jugend, Öffentlichkeitsarbeit und Geschäftsstelle.',
    'historie'      => 'Über 50 Jahre Tennis in Biblis: die Geschichte des TC Biblis 1973 e.V. von der Gründung bis heute.',
    'werbepartner'  => 'Regionale Unternehmen unterstützen den TC Biblis und seine Jugendarbeit. Werden auch Sie Werbepartner.',
    'mitgliedschaft'=> 'Mitglied werden beim TC Biblis 1973 e.V.: Zugang zu 7 Sandplätzen, 3-Feld-Halle, Mannschafts-, Jugend- und Breitensport sowie Vereinsleben.',
    'termine-news'  => 'Termine und Neuigkeiten des TC Biblis 1973 e.V.: feste Spielzeiten, Hobbyrunde, Training und aktuelle Meldungen aus dem Verein.',
    'archiv'        => 'Das Vereinsarchiv des TC Biblis 1973 e.V.: alle Beiträge, Berichte und Einladungen seit 2010.',
    'impressum'     => 'Impressum des TC Biblis 1973 e.V.',
    'datenschutz'   => 'Datenschutzerklärung und Cookie-Hinweise des TC Biblis 1973 e.V.',
  );
}

function tcb_current_description() {
  $map = tcb_page_descriptions();
  if (is_front_page()) return $map['front'];
  if (is_page()) {
    $slug = get_post_field('post_name', get_queried_object_id());
    if (isset($map[$slug])) return $map[$slug];
  }
  if (is_singular()) {
    $post = get_queried_object();
    $text = wp_strip_all_tags(strip_shortcodes($post->post_content));
    $text = preg_replace('/\s+/', ' ', $text);
    return wp_trim_words($text, 26, ' …');
  }
  return $map['front'];
}

// Front page title (the template renders the home, there is no page object).
add_filter('document_title_parts', function ($parts) {
  if (is_front_page()) {
    $parts['title'] = 'TC Biblis 1973 e.V. · Tennisclub in Biblis';
    unset($parts['site']);
  }
  if (is_home() && !is_front_page()) $parts['title'] = 'Vereinsarchiv';
  return $parts;
});

add_action('wp_head', function () {
  $desc  = tcb_current_description();
  $title = wp_get_document_title();
  $url   = is_front_page() ? home_url('/') : (is_singular() ? get_permalink() : home_url(add_query_arg(array(), $GLOBALS['wp']->request ? '/' . $GLOBALS['wp']->request . '/' : '/')));
  $img   = get_theme_file_uri('img/hero.jpg');
  if (is_singular() && has_post_thumbnail()) $img = get_the_post_thumbnail_url(null, 'large');
  echo '<meta name="description" content="' . esc_attr($desc) . '">' . "\n";
  if (is_front_page()) echo '<link rel="canonical" href="' . esc_url(home_url('/')) . '">' . "\n";
  echo '<meta property="og:locale" content="de_DE">' . "\n";
  echo '<meta property="og:site_name" content="TC Biblis 1973 e.V.">' . "\n";
  echo '<meta property="og:type" content="' . (is_singular('post') ? 'article' : 'website') . '">' . "\n";
  echo '<meta property="og:title" content="' . esc_attr($title) . '">' . "\n";
  echo '<meta property="og:description" content="' . esc_attr($desc) . '">' . "\n";
  echo '<meta property="og:url" content="' . esc_url($url) . '">' . "\n";
  echo '<meta property="og:image" content="' . esc_url($img) . '">' . "\n";
  echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
  echo '<meta name="twitter:title" content="' . esc_attr($title) . '">' . "\n";
  echo '<meta name="twitter:description" content="' . esc_attr($desc) . '">' . "\n";
  echo '<meta name="twitter:image" content="' . esc_url($img) . '">' . "\n";
  if (is_front_page()) {
    $ld = array(
      '@context' => 'https://schema.org',
      '@type'    => 'SportsClub',
      'name'     => 'TC Biblis 1973 e.V.',
      'alternateName' => 'Tennisclub Biblis',
      'url'      => home_url('/'),
      'logo'     => get_theme_file_uri('img/logo.png'),
      'image'    => $img,
      'foundingDate' => '1973',
      'sport'    => 'Tennis',
      'email'    => 'geschaeftsstelle@tc-biblis.de',
      'address'  => array('@type' => 'PostalAddress', 'streetAddress' => 'Josef-Seib-Straße 7-9', 'postalCode' => '68647', 'addressLocality' => 'Biblis', 'addressCountry' => 'DE'),
      'amenityFeature' => array(
        array('@type' => 'LocationFeatureSpecification', 'name' => '7 Sandplätze', 'value' => true),
        array('@type' => 'LocationFeatureSpecification', 'name' => '3-Feld-Tennishalle', 'value' => true),
        array('@type' => 'LocationFeatureSpecification', 'name' => 'Clubhaus mit Gaststätte', 'value' => true),
      ),
    );
    echo '<script type="application/ld+json">' . wp_json_encode($ld, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>' . "\n";
  }
}, 6);

// Thin archives: keep them out of the index, let crawlers follow links.
add_filter('wp_robots', function ($robots) {
  if (is_author() || is_tag() || is_category() || is_date() || is_search() || is_attachment() || is_paged() && !is_home()) {
    $robots['noindex'] = true; $robots['follow'] = true; unset($robots['max-image-preview']);
  }
  return $robots;
});

// Sitemap: pages and posts only (no author or taxonomy sitemaps).
add_filter('wp_sitemaps_add_provider', function ($provider, $name) {
  return in_array($name, array('users', 'taxonomies'), true) ? false : $provider;
}, 10, 2);

// Leaner head: no emoji scripts, no author archive leaking the login name.
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');
add_action('template_redirect', function () { if (is_author()) { wp_redirect(home_url('/archiv/'), 301); exit; } });
