module.exports = function (eleventyConfig) {
  // Bilder, CSS und sonstige Dateien unverändert mit ausliefern
  eleventyConfig.addPassthroughCopy("src/assets");

  // Damit Eleventy bei Änderungen an CSS/Bildern die Vorschau neu lädt
  eleventyConfig.addWatchTarget("src/assets");

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    // Seiteninhalte werden in Markdown geschrieben, Layout in Nunjucks (.njk)
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
