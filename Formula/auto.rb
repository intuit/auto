class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.25.4/auto-macos.gz"
  version "v9.25.4"
  sha256 "640e1986fd85b10bb598bf2e0faeab7a430dbb3476889ef67e7b7ae4f6bcade7"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end