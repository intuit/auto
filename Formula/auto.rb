class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v11.0.4/auto-macos.gz"
  version "v11.0.4"
  sha256 "044fabfb95c1b6960f389fa18c0c1fa8ce8df147ec46ae0015f93e20437148e3"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end