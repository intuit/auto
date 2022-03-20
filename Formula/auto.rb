class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.36.0/auto-macos.gz"
  version "v10.36.0"
  sha256 "9703a9182db6827fddcd6e2b341d414bbe6d4a97d2d88c53eb836a314e434be0"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end