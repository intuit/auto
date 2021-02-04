class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.14.1/auto-macos.gz"
  version "v10.14.1"
  sha256 "1f56dafc4a572b5e47726e7eba9fe2ae02e559ccfde261c9e71179d356792c2b"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end