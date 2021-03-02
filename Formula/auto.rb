class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.17.0/auto-macos.gz"
  version "v10.17.0"
  sha256 "77ffd99ed4065a4a81e011552a656478595ce6cb20b27d6fc869eed06cdc2c35"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end