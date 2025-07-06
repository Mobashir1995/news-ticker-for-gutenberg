<?php
// This file is generated. Do not modify it manually.
return array(
	'news-ticker-for-gutenberg' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'news-ticker-for-gutenberg/news-ticker',
		'version' => '1.0.0',
		'title' => 'News Ticker',
		'description' => 'A comprehensive news ticker block for Gutenberg with multiple animation types, query controls, and customization options.',
		'category' => 'widgets',
		'icon' => 'megaphone',
		'keywords' => array(
			'news',
			'ticker'
		),
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'postsToShow' => array(
				'type' => 'number',
				'default' => 5
			)
		),
		'textdomain' => 'news-ticker-for-gutenberg',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'script' => 'file:./script.js',
		'render' => 'file:./render.php'
	)
);
