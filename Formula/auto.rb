class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v9.52.0/auto-macos.gz"
  version "v9.52.0"
  sha256 "a651532f6292854b2402030a4d60939d877b6f7a5053861a7edda71f4b1c0ea8"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end