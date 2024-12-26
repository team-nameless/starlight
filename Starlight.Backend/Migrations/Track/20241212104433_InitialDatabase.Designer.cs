﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Starlight.Backend.Service;

#nullable disable

namespace Starlight.Backend.Migrations.Track
{
    [DbContext(typeof(TrackDatabaseService))]
    [Migration("20241212104433_InitialDatabase")]
    partial class InitialDatabase
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "8.0.11");

            modelBuilder.Entity("Starlight.Backend.Database.Track.Track", b =>
                {
                    b.Property<ulong>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Artist")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("TEXT");

                    b.Property<string>("AudioFileLocation")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("TEXT");

                    b.Property<string>("BackgroundFileLocation")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("TEXT");

                    b.Property<string>("DataFileLocation")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("TEXT");

                    b.Property<double>("Difficulty")
                        .HasColumnType("REAL");

                    b.Property<string>("DifficultyFavorText")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("TEXT");

                    b.Property<ulong>("Duration")
                        .HasColumnType("INTEGER");

                    b.Property<string>("NoteDesigner")
                        .IsRequired()
                        .HasMaxLength(128)
                        .HasColumnType("TEXT");

                    b.Property<string>("Source")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("TEXT");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Tracks");

                    b.HasData(
                        new
                        {
                            Id = 586954ul,
                            Artist = "AK X LYNX feat. Veela",
                            AudioFileLocation = "static/586954/AK x LYNX ft. Veela - Virtual Paradise.mp3",
                            BackgroundFileLocation = "static/586954/Bgparadise.jpg",
                            DataFileLocation = "static/586954/586954.json",
                            Difficulty = 2.7000000000000002,
                            DifficultyFavorText = "HD",
                            Duration = 88276ul,
                            NoteDesigner = "Hydria",
                            Source = "N/A",
                            Title = "Virtual Paradise (Cut Ver.)"
                        },
                        new
                        {
                            Id = 2128243ul,
                            Artist = "DAOKO x Kenshi Yonezu",
                            AudioFileLocation = "static/2128243/audio.mp3",
                            BackgroundFileLocation = "static/2128243/bg.jpg",
                            DataFileLocation = "static/2128243/2128243.json",
                            Difficulty = 1.1000000000000001,
                            DifficultyFavorText = "EZ",
                            Duration = 87500ul,
                            NoteDesigner = "Sympho",
                            Source = "打ち上げ花火、下から見るか？横から見るか？",
                            Title = "Uchiage Hanabi (Cut Ver.)"
                        },
                        new
                        {
                            Id = 2211127ul,
                            Artist = "Alya (CV: Uesaka Sumire)",
                            AudioFileLocation = "static/2211127/audio.ogg",
                            BackgroundFileLocation = "static/2211127/3.jpg",
                            DataFileLocation = "static/2211127/2211127.json",
                            Difficulty = 1.3999999999999999,
                            DifficultyFavorText = "EZ",
                            Duration = 86219ul,
                            NoteDesigner = "keksikosu",
                            Source = "時々ボソッとロシア語でデレる隣のアーリャさん",
                            Title = "Ichiban Kagayaku Hoshi"
                        },
                        new
                        {
                            Id = 2212131ul,
                            Artist = "Alya (CV: Uesaka Sumire)",
                            AudioFileLocation = "static/2212131/chuowo.ogg",
                            BackgroundFileLocation = "static/2212131/alya.jpg",
                            DataFileLocation = "static/2212131/2212131.json",
                            Difficulty = 2.1000000000000001,
                            DifficultyFavorText = "NM",
                            Duration = 88518ul,
                            NoteDesigner = "Damaree",
                            Source = "時々ボソッとロシア語でデレる隣のアーリャさん",
                            Title = "Kawaikute Gomen"
                        });
                });
#pragma warning restore 612, 618
        }
    }
}