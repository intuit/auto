class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.32.1/auto-macos.gz"
  version "v9.32.1"
  sha256 "e4d7aa2da524c46655ff4fe9bbe297cc1fcd40d2779201bd00234414b3bb409f"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end