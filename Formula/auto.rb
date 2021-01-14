class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.8.0/auto-macos.gz"
  version "v10.8.0"
  sha256 "8643f67441a3ae33c78c79ee71a2b237e03dd30b47b55e791109e018a52e05ae"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end