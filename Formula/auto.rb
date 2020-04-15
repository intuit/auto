class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.27.2/auto-macos.gz"
  version "v9.27.2"
  sha256 "9c5b22d11bfdc408b393873e53b6ef2acb415a4f29ea189e8ae79d5926e22f41"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end