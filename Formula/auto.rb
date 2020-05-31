class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.38.0/auto-macos.gz"
  version "v9.38.0"
  sha256 "3856d4ee8790660aca853dd1dae35ca3f194072492bdfb3a38c29a7d90f59650"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end